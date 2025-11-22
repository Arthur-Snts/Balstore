from models import  Loja
from config import engine
from sqlmodel import Session, select
from fastapi import HTTPException, Depends, APIRouter, Header
from typing import Annotated
from pydantic import BaseModel
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy.orm import selectinload
import os
import jwt
from datetime import datetime, timedelta


def get_session():
    with Session(engine) as session:
        yield session

SessionDep = Annotated[Session, Depends(get_session)]

router = APIRouter(prefix="/lojas", tags=["lojas"])

SECRET_KEY = "CHAVE_SECRETA_SUPER_SEGURA"
ALGORITHM = "HS256"
JWT_VERIFY_IAT = os.getenv("JWT_VERIFY_IAT", "false").lower() == "true"
try:
    JWT_LEEWAY = int(os.getenv("JWT_LEEWAY", "30"))
except Exception:
    JWT_LEEWAY = 30
DEBUG_JWT = os.getenv("DEBUG_JWT", "false").lower() == "true"


def criar_access_token(data: dict, expires_minutes=60):
    payload = data.copy()
    if "sub" in payload and payload["sub"] is not None:
        payload["sub"] = str(payload["sub"])

    now_ts = int(datetime.utcnow().timestamp())
    payload["iat"] = now_ts - 5
    payload["exp"] = now_ts + (expires_minutes * 60)
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    if DEBUG_JWT:
        try:
            print(f">>>> criar_access_token: iat={payload['iat']} exp={payload['exp']} server_ts={now_ts}")
        except Exception:
            pass
    return token


def criar_refresh_token(data: dict, expires_days=7):
    payload = data.copy()
    if "sub" in payload and payload["sub"] is not None:
        payload["sub"] = str(payload["sub"])
    now_ts = int(datetime.utcnow().timestamp())
    payload["iat"] = now_ts - 5
    payload["exp"] = now_ts + (expires_days * 24 * 3600)
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    if DEBUG_JWT:
        try:
            print(f">>>> criar_refresh_token: iat={payload['iat']} exp={payload['exp']} server_ts={now_ts}")
        except Exception:
            pass
    return token


def verificar_token(authorization: str = Header(None, alias="Authorization")):
    print(">>>> verificar_token chamado")
    print("AUTH HEADER raw:", authorization)

    if not authorization or not authorization.startswith("Bearer "):
        print("ERRO: Header inválido ou ausente")
        raise HTTPException(status_code=401, detail="Token ausente ou formato inválido")

    token = authorization.split()[1]
    if DEBUG_JWT:
        print("Token extraído:", token[:30] + "..." if len(token) > 30 else token)
        server_ts = int(datetime.utcnow().timestamp())
        try:
            print(f"verificar_token server_ts={server_ts}")
        except Exception:
            pass

        try:
            unverified = jwt.decode(token, options={"verify_signature": False, "verify_exp": False})
            print("verificar_token unverified payload:", unverified)
            if "iat" in unverified:
                try:
                    print("iat type:", type(unverified["iat"]), "value:", unverified["iat"]) 
                except Exception:
                    pass
        except Exception as e:
            print("erro ao decodificar unverified:", e)

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM], leeway=JWT_LEEWAY, options={"verify_iat": JWT_VERIFY_IAT})
        print("payload OK:", payload)
        return payload

    except jwt.ExpiredSignatureError:
        print("ERRO: expirado")
        raise HTTPException(status_code=401, detail="Token expirado")

    except jwt.InvalidTokenError as e:
        print("ERRO: token inválido ->", str(e))
        raise HTTPException(status_code=401, detail="Token inválido")

#////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                        #Loja
#////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


class Login(BaseModel):
    loj_email: str
    loj_senha: str


@router.post("/login")
def login(login:Login, session:SessionDep):
    
    loja = session.exec(select(Loja).where(Loja.email == login.loj_email)).first()
    if not loja or not check_password_hash(loja.senha, login.loj_senha):
        raise HTTPException(status_code=401, detail="Credenciais inválidas.")

    access_token = criar_access_token({"sub": loja.id})
    refresh_token = criar_refresh_token({"sub": loja.id})

    return {
        "access_token": access_token,
        "refresh_token": refresh_token
    }

class RefreshRequest(BaseModel):
    refresh_token: str

@router.post("/refresh")
def refresh_token_endpoint(request: RefreshRequest):
    refresh_token = request.refresh_token
    print(">>>> /refresh chamado com refresh_token:", refresh_token[:30] + "..." if refresh_token else None)

    try:
        # permitir clock skew/leeway e controlar verificação de iat por variável de ambiente
        payload = jwt.decode(refresh_token, SECRET_KEY, algorithms=[ALGORITHM], leeway=JWT_LEEWAY, options={"verify_iat": JWT_VERIFY_IAT})
        if DEBUG_JWT:
            print("/refresh payload decodificado:", payload)
        user_id = payload.get("sub")
        if not user_id:
            print("/refresh sem sub no payload")
            raise HTTPException(status_code=401, detail="Refresh token inválido")
    except jwt.ExpiredSignatureError as e:
        print("/refresh ERRO: expirado ->", str(e))
        raise HTTPException(status_code=401, detail="Refresh token expirado")
    except jwt.InvalidTokenError as e:
        print("/refresh ERRO: inválido ->", str(e))
        raise HTTPException(status_code=401, detail="Refresh token inválido")

    new_access = criar_access_token({"sub": user_id})
    print("/refresh gerou novo access")
    return {"access_token": new_access}

@router.get("/tracking/status")
def tracking_status(session: SessionDep,user=Depends(verificar_token)):
    user_id = user["sub"]

    loja = session.exec(select(Loja).where(Loja.id ==user_id)).first()
    if not loja:
        raise HTTPException(404, "loja não encontrado")

    # Remove a senha antes de retornar
    loja_dict = loja.model_dump()
    loja_dict.pop("senha", None)

    return {"status": "autorizado", "user": loja_dict}


# ------------------------------------------------------------------------------
# Busca
@router.get("/")
def busca_loja(session: SessionDep,loj_email: str = None, loj_nome:str=None, loj_cnpj:str = None, loj_id:int = None):


    query = select(Loja).options(selectinload(Loja.produtos), selectinload(Loja.notificacoes))

    if loj_email:
        query = query.where(Loja.email == loj_email)
    if loj_nome:
        query = query.where(Loja.nome.contains(loj_nome))
    if loj_cnpj:
        query = query.where(Loja.cnpj == loj_cnpj)
    if loj_id:
        query = query.where(Loja.id == loj_id)

    lojas = session.exec(query).all()

    resultado = []
    for c in lojas:
        resultado.append({
            **c.model_dump(),
            "produtos": [p.model_dump() for p in c.produtos] if c.produtos else [],
            "notificacoes": [n.model_dump() for n in c.notificacoes] if c.notificacoes else [],
        })

    if len(resultado) == 1:
        return resultado[0]
    else:
        return resultado

# ------------------------------------------------------------------------------
# CADASTRO
@router.post("/")
def cadastra_loja(loja_cadastra: Loja, session: SessionDep):

    loja_existente = session.exec(
        select(Loja).where(Loja.email == loja_cadastra.email)
    ).first()

    if loja_existente:
        raise HTTPException(400, "Email já cadastrado")
    
    loja_existente = session.exec(
        select(Loja).where(Loja.cnpj == loja_cadastra.cnpj)
    ).first()

    if loja_existente:
        raise HTTPException(400, "CNPJ já cadastrado")
    
    loja_existente = session.exec(
        select(Loja).where(Loja.nome == loja_cadastra.nome)
    ).first()

    if loja_existente:
        raise HTTPException(400, "Nome de Loja já cadastrado")

    loja_cadastra.senha = generate_password_hash(loja_cadastra.senha, method="pbkdf2:sha256")

    session.add(loja_cadastra)
    session.commit()
    session.refresh(loja_cadastra)

    return {"mensagem": "Perfil cadastrado com sucesso", "loja": loja_cadastra}

# ------------------------------------------------------------------------------
# DELETE
@router.delete("/{loj_id}")
def deleta_loja(loj_id: int, session: SessionDep):
    
    loja = session.get(Loja, loj_id)

    if not loja:
        raise HTTPException(404, "Loja não encontrada")

    session.delete(loja)
    session.commit()

    return {"mensagem": "Loja deletada com sucesso"}

# ------------------------------------------------------------------------------
# UPDATE
@router.put("/{loj_id}")
def atualiza_loja(session: SessionDep,loj_id:int,loj_nome:str=None, loj_email:str=None, loj_senha:str=None):

    loja = session.get(Loja, loj_id)
    
    if not loja:
        raise HTTPException(404, "Loja não encontrada pelo ID, Verifique a informação.")

    if loj_nome:
        loja.nome = loj_nome
    if loj_email:
        loja.email = loj_email
    if loj_senha:
        loja.senha = generate_password_hash(loj_senha, method="pbkdf2:sha256")

    session.add(loja)
    session.commit()
    session.refresh(loja)

    return {"mensagem": "Perfil editado com sucesso", "loja": loja}