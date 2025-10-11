from models import  Loja
from config import engine
from sqlmodel import Session, select
from fastapi import HTTPException, Depends, APIRouter
from typing import Annotated
from werkzeug.security import generate_password_hash, check_password_hash


def get_session():
    with Session(engine) as session:
        yield session

SessionDep = Annotated[Session, Depends(get_session)]

router = APIRouter(prefix="/lojas", tags=["lojas"])


#////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                        #Loja
#////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

# ------------------------------------------------------------------------------
# LOGIN
@router.get("/")
def busca_ou_login_loja(session: SessionDep,loj_email: str = None, loj_senha: str=None, loj_nome:str=None, loj_cnpj:str = None, loj_id:int = None):

    if loj_email and loj_senha:
        loja = session.exec(
            select(Loja).where(Loja.email == loj_email)
        ).first()

        if not loja:
            raise HTTPException(404, "Email inexistente")

        if check_password_hash(loja.senha, loj_senha):
            return {"mensagem": "Login Realizado com Sucesso"}
        else:
            raise HTTPException(401, "Senha Incorreta")

    if loj_email:
        loja = session.exec(
            select(Loja).where(Loja.email == loj_email)
        ).first()   
    if loj_nome:
        loja = session.exec(
            select(Loja).where(Loja.nome.contains(loj_nome))
        ).all()
    if loj_cnpj:
        loja = session.exec(
            select(Loja).where(Loja.cnpj == loj_cnpj)
        ).first()
    if loj_id:
        loja = session.exec(
            select(Loja).where(Loja.id == loj_id)
        ).first()

    return loja

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