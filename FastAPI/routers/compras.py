from models import Compra, Compra_Produto, Produto
from config import engine
from sqlmodel import Session, select
from fastapi import HTTPException, Depends, APIRouter
from typing import Annotated
from datetime import datetime
from sqlalchemy.orm import selectinload


def get_session():
    with Session(engine) as session:
        yield session

SessionDep = Annotated[Session, Depends(get_session)]

router = APIRouter(prefix="/compras", tags=["compras"])


# ------------------------------------------------------------------------------
#////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                        #Compra
#////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
# ------------------------------------------------------------------------------
# GET
@router.get("/{cli_id}")
def pega_compra(session: SessionDep, cli_id:int, data_pos:datetime= None, data_antes:datetime = None, com_id:int = None):

    query = select(Compra).options(selectinload(Compra.cliente),
                                    selectinload(Compra.produtos))

    
    query = query.where(Compra.cliente_id == cli_id)
    
    if data_antes:
        query = query.where(Compra.data <= data_antes).all()
        if not query:
            raise HTTPException(400, "Cliente sem histórico de Compras anterior a esse período")
    
    if data_antes and data_pos:
        query = query.where(Compra.data >= data_pos, Compra.data <= data_antes).all()
        if not query:
            raise HTTPException(400, "Cliente sem histórico de Compras nesse período")
    
    if com_id:
        query = query.where(Compra.id == com_id).first()
        if not query:
            raise HTTPException(400, "Compra não encontrada")

    compra = session.exec(query).all()

    resultado=[]
    for c in compra:
        resultado.append({
            **c.model_dump(),
            "cliente": c.cliente.model_dump() if c.cliente else None,
            "produtos": [a.model_dump() for a in c.produtos] if c.produtos else []
        })

    return resultado


# ------------------------------------------------------------------------------
# POST

@router.post("/{cli_id}")
def cadastra_compra(session: SessionDep, cli_id:int, compra_cadastra:Compra, produtos:list[int]):

    compra_existente = session.exec(
        select(Compra).where(Compra.cliente_id == cli_id, Compra.data == compra_cadastra.data)
    ).first()

    if compra_existente:
        raise HTTPException(400, "Compra já cadastrada nesse Cliente")

    session.add(compra_cadastra)
    session.commit()
    session.refresh(compra_cadastra)


    for produto in produtos:
        pro_id = session.exec(select(Produto).where(Produto.id == produto)).first()
        compra_produto = Compra_Produto(pro_id=pro_id.id, com_id=compra_cadastra.id)
        session.add(compra_produto)
        session.refresh(compra_produto)

    session.commit()

    return {"mensagem": "Compra cadastrada com sucesso", "Compra": compra_cadastra}

# ------------------------------------------------------------------------------
# PUT

@router.put("/{com_id}")
def atualiza_compra(session: SessionDep,com_id:int, cod_rastreio: str =None, cod_pagamento: str =None, situacao: str = None, frete: float = None):
    
    compra_atualizar = session.exec(
        select(Compra).where(Compra.id == com_id)
    ).first()

    if not compra_atualizar:
        raise HTTPException(404, "Compra não encontrada")
    
    if cod_rastreio:
        compra_atualizar.cod_rastreio = cod_rastreio
    if situacao:
        compra_atualizar.situacao = situacao 

    session.add(compra_atualizar)
    session.commit()
    session.refresh(compra_atualizar)

    return {"mensagem": "Compra atualizada com sucesso!"}