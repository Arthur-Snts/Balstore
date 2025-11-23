from models import  Amigo, Cliente
from config import  engine
from sqlmodel import Session, select
from fastapi import HTTPException, Depends, APIRouter
from typing import Annotated
from sqlalchemy.orm import selectinload


def get_session():
    with Session(engine) as session:
        yield session

SessionDep = Annotated[Session, Depends(get_session)]


router = APIRouter(prefix="/amigos", tags=["amigos"])



# ------------------------------------------------------------------------------
#////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                        #Amigo
#////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
# ------------------------------------------------------------------------------
# GET

@router.get("/{cli_id}")
def pega_amigos(cli_id:int, session: SessionDep):

    query = select(Amigo).options(selectinload(Amigo.cliente_de),
                                    selectinload(Amigo.cliente_amigo))
    

    query = query.where(Amigo.amigo == cli_id)
    
    
    amigo = session.exec(query).all()

    
   

    resultado = []

    for c in amigo:
        resultado.append({
            **c.model_dump(),
            "cliente_de": c.cliente_de.model_dump() if c.cliente_de else None,
            "cliente_amigo": c.cliente_amigo.model_dump() if c.cliente_amigo else None
        })
    
    return resultado
# ------------------------------------------------------------------------------
# POST

@router.post("/")
def adiciona_amigo(amigo:Amigo, session:SessionDep):

    amizade_existente = session.exec(
        select(Amigo).where(Amigo.amigo_de == amigo.amigo_de, Amigo.amigo == amigo.amigo)
    ).first()

    if amizade_existente:
        raise HTTPException(400, "Amizade já existe com esses usuários")

    if amigo.amigo_de == amigo.amigo:
        raise HTTPException(400, "Tentativa de cadastrar uma amizade hemafrodita")

    session.add(amigo)
    session.commit()
    session.refresh(amigo)

    return {"mensagem": "Amizade cadastrada com sucesso", "amigo": amigo}

# ------------------------------------------------------------------------------
# DELETE

@router.delete("/{cli_id}")
def desfaz_amizade(session: SessionDep, cli_id:int, amigo_exclui:int):

    amigo_deletado = session.exec(
        select(Amigo).where(Amigo.amigo == amigo_exclui, Amigo.amigo_de == cli_id)
    ).first()

    if not amigo_deletado:
        raise HTTPException(404, "Amigo não encontrado nas amizades desse Cliente")

    session.delete(amigo_deletado)
    session.commit()

    amigo_inverso_deletado = session.exec(
        select(Amigo).where(Amigo.amigo == cli_id, Amigo.amigo_de == amigo_exclui)
    ).first()

    if amigo_inverso_deletado:

        session.delete(amigo_inverso_deletado)
        session.commit()

    return {"mensagem": "Amigo deletado com sucesso desse Cliente"}

# ------------------------------------------------------------------------------
# PUT
@router.put("/{cli_id}")
def atualiza_amizade(session: SessionDep, cli_id:int, status_novo:str, amigo_id:int):
    amigo_atualizar = session.exec(
        select(Amigo).where(Amigo.amigo == amigo_id, Amigo.amigo_de == cli_id)
    ).first()

    if not amigo_atualizar:
        raise HTTPException(404, "Amigo não encontrado nas amizades desse Cliente")
    
    amigo_atualizar.solicitacao = status_novo

    session.add(amigo_atualizar)
    session.commit()
    session.refresh(amigo_atualizar)

    return {"mensagem": "Amigo atualizado com sucesso desse Cliente"}