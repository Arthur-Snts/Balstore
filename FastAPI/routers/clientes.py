from models import Cliente
from config import engine
from sqlmodel import Session, select
from fastapi import HTTPException, Depends, APIRouter
from typing import Annotated
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy.orm import selectinload




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


    if cli_email and cli_senha:


        cliente = session.exec(
            select(Cliente).where(Cliente.email == cli_email)
        ).first()


        if not cliente:
            raise HTTPException(404, "Email inexistente")


        if check_password_hash(cliente.senha, cli_senha):
            return {"mensagem": "Login Realizado com Sucesso"}
        else:
            raise HTTPException(401, "Senha Incorreta")
   
    query = select(Cliente).options(selectinload(Cliente.enderecos),
                                    selectinload(Cliente.comentarios),
                                    selectinload(Cliente.favoritos),
                                    selectinload(Cliente.carrinhos),
                                    selectinload(Cliente.notificacoes),
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
        query = query.where(Cliente.nome == cli_nome)
        nome = session.exec(query).all()
        if not nome:
           raise HTTPException(404, "nome do cliente inexistente")
       
    if cli_cpf:
        query = query.where(Cliente.cpf == cli_cpf)
        cpf = session.exec(query).all()
        if not cpf:
           raise HTTPException(404, "cpf do cliente inexistente")


    cliente = session.exec(query).all()


    resultado = []
    for c in cliente:
        resultado.append({
            **c.model_dump(),
            "enderecos": [e.model_dump() for e in c.comentarios] if c.comentarios else [],
            "comentarios": [come.model_dump() for come in c.comentarios] if c.comentarios else [],
            "favoritos": [f.model_dump() for f in c.favoritos] if c.favoritos else [],
            "carrinhos": [car.model_dump() for car in c.carrinhos] if c.carrinhos else [],
            "notificacoes": [n.model_dump() for n in c.notificacoes] if c.notificacoes else [],
            "compras": [comp.model_dump() for comp in c.compras] if c.compras else [],
            "presentes": [p.model_dump() for p in c.presentes] if c.presentes else [],
            "amigos_enviados": [ae.model_dump() for ae in c.amigos_enviados] if c.amigos_enviados else [],
            "amigos_recebidos": [ar.model_dump() for ar in c.amigos_recebidos] if c.amigos_recebidos else [],
            "amigos_recebidos": [ar.model_dump() for ar in c.amigos_recebidos] if c.clie else []


        })


    return resultado


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
        cliente.senha = generate_password_hash(cli_senha, method="pbkdf2:sha256")


    session.add(cliente)
    session.commit()
    session.refresh(cliente)


    return {"mensagem": "Perfil editado com sucesso", "cliente": cliente}


