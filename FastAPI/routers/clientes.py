from models import Cliente
from config import engine
from sqlmodel import Session, select
from fastapi import HTTPException, Depends, APIRouter, Header
from typing import Annotated
from pydantic import BaseModel
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy.orm import selectinload
import jwt
from datetime import datetime, timedelta
import os

def get_session():
    with Session(engine) as session:
        yield session


SessionDep = Annotated[Session, Depends(get_session)]


router = APIRouter(prefix="/clientes", tags=["clientes"])

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
                                                        #Clientes
#////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

class Login(BaseModel):
    cli_email: str
    cli_senha: str


@router.post("/login")
def login(login:Login, session:SessionDep):
    
    cliente = session.exec(select(Cliente).where(Cliente.email == login.cli_email)).first()
    if not cliente or not check_password_hash(cliente.senha, login.cli_senha):
        raise HTTPException(status_code=401, detail="Credenciais inválidas")

    access_token = criar_access_token({"sub": cliente.id})
    refresh_token = criar_refresh_token({"sub": cliente.id})

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

    cliente = busca_cliente(session, cli_id = user_id)
    if not cliente:
        raise HTTPException(404, "Cliente não encontrado")
    

    return {"status": "autorizado", "user": cliente}

# ------------------------------------------------------------------------------
# Busca
@router.get("/")
def busca_cliente(session: SessionDep, cli_email: str = None, cli_nome:str=None, cli_cpf:str=None, cli_id:int = None):

    query = select(Cliente).options(selectinload(Cliente.enderecos),
                                    selectinload(Cliente.comentarios),
                                    selectinload(Cliente.favoritos),
                                    selectinload(Cliente.carrinhos),
                                    selectinload(Cliente.compras),
                                    selectinload(Cliente.presentes),
                                    selectinload(Cliente.amigos_enviados),
                                    selectinload(Cliente.amigos_recebidos))


    if cli_email:
        query = query.where(Cliente.email == cli_email)
        email = session.exec(query).all()
        if not email:
           raise HTTPException(404, "email do cliente inexistente")


    if cli_nome:
        query = query.where(Cliente.nome.contains(cli_nome))
        nome = session.exec(query).all()
        if not nome:
           raise HTTPException(404, "nenhum cliente com essa letra")
       
    if cli_cpf:
        query = query.where(Cliente.cpf == cli_cpf)
        cpf = session.exec(query).all()
        if not cpf:
           raise HTTPException(404, "cpf do cliente inexistente")
        
    if cli_id:
        query = query.where(Cliente.id == cli_id)
        id = session.exec(query).all()
        if not id:
           raise HTTPException(404, "id do cliente inexistente")


    cliente = session.exec(query).all()


    resultado = []
    for c in cliente:
        resultado.append({
            **c.model_dump(),
            "enderecos": [e.model_dump() for e in c.enderecos] if c.enderecos else [],
            "comentarios": [come.model_dump() for come in c.comentarios] if c.comentarios else [],
            "favoritos": [f.model_dump() for f in c.favoritos] if c.favoritos else [],
            "carrinhos": [car.model_dump() for car in c.carrinhos] if c.carrinhos else [],
            "compras": [comp.model_dump() for comp in c.compras] if c.compras else [],
            "presentes": [p.model_dump() for p in c.presentes] if c.presentes else [],
            "amigos_enviados": [ae.model_dump() for ae in c.amigos_enviados] if c.amigos_enviados else [],
            "amigos_recebidos": [ar.model_dump() for ar in c.amigos_recebidos] if c.amigos_recebidos else []
            


        })

    if len(resultado) == 1:
        return resultado[0]
    else:
        return resultado

# ------------------------------------------------------------------------------
# CADASTRO

def limpar_cpf(cpf: str) -> str:
    return ''.join(filter(str.isdigit, cpf))

@router.post("/")
def cadastra_cliente(cliente_cadastra: Cliente, session: SessionDep):


    cliente_cadastra.cpf = limpar_cpf(cliente_cadastra.cpf)

    cliente_existente = session.exec(
        select(Cliente).where(Cliente.email == cliente_cadastra.email)
    ).first()

    if cliente_existente:
        raise HTTPException(400, "Email já cadastrado")
   
    cliente_existente = session.exec(
        select(Cliente).where(Cliente.cpf == cliente_cadastra.cpf)
    ).first()


    if cliente_existente:
        raise HTTPException(400, "CPF já cadastrado")


    cliente_cadastra.senha = generate_password_hash(cliente_cadastra.senha,method="pbkdf2:sha256")


   
    session.add(cliente_cadastra)
    session.commit()
    session.refresh(cliente_cadastra)
   


    return {"mensagem": "Perfil cadastrado com sucesso", "cliente": cliente_cadastra}


# ------------------------------------------------------------------------------
# DELETE
@router.delete("/{cli_id}")
def deleta_cliente(cli_id: int, session: SessionDep):
   
    cliente = session.get(Cliente, cli_id)


    if not cliente:
        raise HTTPException(404, "Perfil não encontrado")


    session.delete(cliente)
    session.commit()


    return {"mensagem": "Perfil deletado com sucesso"}


# ------------------------------------------------------------------------------
# UPDATE
from typing import Optional
class ClienteUpdate(BaseModel):
    cli_nome: Optional[str] = None
    cli_email: Optional[str] = None
    cli_senha: Optional[str] = None
    cli_senha_antiga: Optional[str] = None

@router.put("/{cli_id}")
def atualiza_cliente(cli_id: int, dados: ClienteUpdate, session: SessionDep):

    cliente = session.get(Cliente, cli_id)

    if not cliente:
        raise HTTPException(404, "Perfil não encontrado")

    if dados.cli_nome:
        cliente.nome = dados.cli_nome

    if dados.cli_email:
        cliente.email = dados.cli_email

    if dados.cli_senha:
        if not dados.cli_senha_antiga:
            raise HTTPException(400, "É necessário enviar a senha antiga para alterar a senha.")

        if check_password_hash(cliente.senha, dados.cli_senha_antiga):
            cliente.senha = generate_password_hash(dados.cli_senha, method="pbkdf2:sha256")
        else:
            raise HTTPException(400, "Senha antiga incorreta.")

    session.add(cliente)
    session.commit()
    session.refresh(cliente)

    return {"mensagem": "Perfil editado com sucesso", "cliente": cliente}


