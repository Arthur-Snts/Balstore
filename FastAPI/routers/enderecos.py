from models import  Endereco
from config import engine
from sqlmodel import Session, select
from fastapi import HTTPException, Depends, APIRouter
from typing import Annotated
from sqlalchemy.orm import selectinload


def get_session():
    with Session(engine) as session:
        yield session

SessionDep = Annotated[Session, Depends(get_session)]

router = APIRouter(prefix="/enderecos", tags=["enderecos"])

# ------------------------------------------------------------------------------
#////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                        #Endereço
#////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
# ------------------------------------------------------------------------------
# GET
@router.get("/")
def pega_enderecos(session: SessionDep, cli_id:int=None, loj_id:int=None):

    query = select(Endereco).options(selectinload(Endereco.cliente), 
                                    selectinload(Endereco.notificacoes)) 

    if cli_id:
        query = query.where(Endereco.cli_id == cli_id)
        
    if loj_id:
        query = query.where(Endereco.loj_id == loj_id)

    if not cli_id and not loj_id:
        raise HTTPException(400, "Nenhum paramentro passado")
    
    enderecos = session.exec(query).all()
    
    resultado = []
    for c in enderecos:
        resultado.append({
            **c.model_dump(),
            "cliente": c.cliente.model_dump() if c.cliente else None,
            "notificacoes": [n.model_dump() for n in c.notificacoes] if c.notificacoes else []
        })

    return resultado

# ------------------------------------------------------------------------------
# POST

@router.post("/")
def cadastra_enderecos(session: SessionDep, endereco:Endereco):

    if endereco.cli_id:
        endereco_existente = session.exec(
            select(Endereco).where(Endereco.cli_id == endereco.cli_id, Endereco.rua == endereco.rua, Endereco.numero == endereco.numero)
        ).first()

        if endereco_existente:
            raise HTTPException(400, "Endereços já cadastrado nesse Cliente")
    if endereco.loj_id:
        endereco_existente = session.exec(
            select(Endereco).where(Endereco.loj_id == endereco.loj_id, Endereco.rua == endereco.rua, Endereco.numero == endereco.numero)
        ).first()

        if endereco_existente:
            raise HTTPException(400, "Endereços já cadastrado nessa Loja")

    session.add(endereco)
    session.commit()
    session.refresh(endereco)

    return {"mensagem": "Endereço cadastrado com Sucesso", "Endereco": endereco}

# ------------------------------------------------------------------------------
# PUT
@router.put("/{end_id}")
def atualiza_endereco(session: SessionDep,end_id:int, rua: str =None, numero: str = None, bairro: str = None, cidade: str = None, estado:str = None, CEP:str = None):
    
    endereco_atualizar = session.exec(
        select(Endereco).where(Endereco.id == end_id)
    ).first()

    if not endereco_atualizar:
        raise HTTPException(404, "Endereço não encontrado")
    
    if rua:
        endereco_atualizar.rua = rua
    if numero:
        endereco_atualizar.numero = numero 
    if bairro:
        endereco_atualizar.bairro = bairro 
    if cidade:
        endereco_atualizar.cidade = cidade 
    if estado:
        endereco_atualizar.estado = estado 
    if CEP:
        endereco_atualizar.CEP = CEP 

    session.add(endereco_atualizar)
    session.commit()
    session.refresh(endereco_atualizar)

    return {"mensagem": "Endereço atualizado com sucesso!"}

# ------------------------------------------------------------------------------
# DELETE

@router.delete("/{end_id}")
def deleta_enderecos(session: SessionDep,end_id:int):

    endereco_deletado = session.exec(
        select(Endereco).where(Endereco.id == end_id)
    ).first()

    if not endereco_deletado:
        raise HTTPException(404, "Endereço não encontrado!")

    session.delete(endereco_deletado)
    session.commit()

    return {"mensagem": "Endereço deletado com sucesso!"}
