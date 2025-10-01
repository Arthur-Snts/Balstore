from models import Cliente
from config import engine
from sqlmodel import Session, select
from fastapi import HTTPException, Depends, APIRouter
from typing import Annotated
from werkzeug.security import generate_password_hash, check_password_hash

def get_session():
    with Session(engine) as session:
        yield session

SessionDep = Annotated[Session, Depends(get_session)]

router = APIRouter(prefix="/clientes", tags=["clientes"])

#////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                        #Clientes
#////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

# ------------------------------------------------------------------------------
# LOGIN
@router.get("/")
def busca_ou_login_cliente(session: SessionDep, cli_email: str = None, cli_senha: str = None, cli_nome:str=None, cli_cpf:str=None):

    cliente = None
    if cli_email and cli_senha:

        cliente = session.exec(
            select(Cliente).where(Cliente.email == cli_email)
        ).first()

        if not cliente:
            raise HTTPException(404, "Email inexistente")

        if not check_password_hash(cli_senha,cliente.senha):
            raise HTTPException(401, "Senha incorreta")
    
    if cli_email:
        cliente = session.exec(
            select(Cliente).where(Cliente.email == cli_email)
        ).first()

    if cli_nome:
        cliente = session.exec(
            select(Cliente).where(Cliente.nome.contains(cli_nome))
        ).all()

    if cli_cpf:
        cliente = session.exec(
            select(Cliente).where(Cliente.cpf == cli_cpf)
        ).first()

    if not cliente:
        raise HTTPException(400, "Nenhum Parâmetro Passado")

    return cliente

# ------------------------------------------------------------------------------
# CADASTRO
@router.post("/")
def cadastra_cliente(cliente_cadastra: Cliente, session: SessionDep):

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

    cliente_cadastra.senha = generate_password_hash(cliente_cadastra.senha)

    session.add(cliente_cadastra)
    session.commit()

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
@router.put("/{cli_id}")
def atualiza_cliente(session: SessionDep,cli_id:int,cli_nome:str=None, cli_email:str=None, cli_senha:str=None):

    cliente = session.get(Cliente, cli_id)
    
    if not cliente:
        raise HTTPException(404, "Perfil não encontrado pelo ID, Verifique a informação.")

    if cli_nome:
        cliente.nome = cli_nome
    if cli_email:
        cliente.email = cli_email
    if cli_senha:
        cliente.senha = generate_password_hash(cli_senha)

    session.add(cliente)
    session.commit()
    session.refresh(cliente)

    return {"mensagem": "Perfil editado com sucesso", "cliente": cliente}
