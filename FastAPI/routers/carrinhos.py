from models import  Carrinho, Produto
from config import engine
from sqlmodel import Session, select
from fastapi import HTTPException, Depends, APIRouter
from typing import Annotated


def get_session():
    with Session(engine) as session:
        yield session

SessionDep = Annotated[Session, Depends(get_session)]

router = APIRouter(prefix="/carrinhos", tags=["carrinhos"])



# ------------------------------------------------------------------------------
#////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                        #Carrinho
#////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
# ------------------------------------------------------------------------------
# GET
@router.get("/{cli_id}")
def pega_carrinho(session: SessionDep, cli_id:int):

    carrinho = session.exec(
        select(Carrinho).where(Carrinho.cliente_id == cli_id)
    ).all()

    

    if not carrinho:
        raise HTTPException(400, "Carrinho do Cliente vazio")
    
    return carrinho
# ------------------------------------------------------------------------------
# POST
@router.post("/")
def coloca_carrinho(carrinho_cadastra:Carrinho, session:SessionDep):

    carrinho_existente = session.exec(
        select(Carrinho).where(Carrinho.produto_id == carrinho_cadastra.produto_id, Carrinho.cliente_id == carrinho_cadastra.cliente_id)
    ).first()

    if carrinho_existente:
        raise HTTPException(400, "Produto já está em seu carrinho")

    session.add(carrinho_cadastra)
    session.commit()
    session.refresh(carrinho_cadastra)

    return {"mensagem": "Produto colocado no carrinho com sucesso", "Produto Colocado": carrinho_cadastra}

# ------------------------------------------------------------------------------
# DELETE
@router.delete("/{car_id}")
def deleta_carrinho(car_id: int, session: SessionDep):

    carrinho_deletado = session.exec(
        select(Carrinho).where(Carrinho.id == car_id)
    ).first()

    if not carrinho_deletado:
        raise HTTPException(404, "Produto não encontrado no carrinho desse Cliente")

    session.delete(carrinho_deletado)
    session.commit()

    return {"mensagem": "Produto deletado com sucesso desse carrinho"}

# ------------------------------------------------------------------------------
# PUT
@router.put("/{car_id}")
def atualiza_carrinho(qnt_nova: int, session: SessionDep, car_id:int):


    carrinho_atualizar = session.exec(
        select(Carrinho).where(Carrinho.id == car_id)
    ).first()

    if not carrinho_atualizar:
        raise HTTPException(404, "Produto não encontrado no carrinho desse Cliente")

    carrinho_atualizar.qnt_produto = qnt_nova

    session.add(carrinho_atualizar)
    session.commit()
    session.refresh(carrinho_atualizar)

    return {"mensagem": "Carrinho editado com sucesso", "Quantidade Nova": qnt_nova}