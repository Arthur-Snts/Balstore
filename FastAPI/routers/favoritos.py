from models import Favorito, Cliente
from config import engine
from sqlmodel import Session, select
from fastapi import HTTPException, Depends, APIRouter
from typing import Annotated

def get_session():
    with Session(engine) as session:
        yield session

SessionDep = Annotated[Session, Depends(get_session)]

router = APIRouter(prefix="/favoritos", tags=["favoritos"])


# ------------------------------------------------------------------------------
#////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                        #Favoritos
#////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
# ------------------------------------------------------------------------------
# GET
@router.get("/{cli_id}")
def pega_favoritos(session: SessionDep, cli_id:int, fav_id:int = None):

    cliente = session.exec(
        select(Cliente).where(Cliente.id == cli_id)
    ).first()

    if not cliente:
        raise HTTPException(400, "Cliente não encontrado")
    
    if fav_id:
        favorito = session.exec(select(Favorito).where(Favorito.id == fav_id))
        return favorito

    return cliente.favoritos

# ------------------------------------------------------------------------------
# POST

@router.post("/{cli_id}")
def cadastra_favoritos(session: SessionDep, cli_id:int, favorito_cadastro:Favorito):

    favorito_existente = session.exec(
        select(Favorito).where(Favorito.cliente_id == cli_id, Favorito.produto_id == favorito_cadastro.produto_id)
    ).first()

    if favorito_existente:
        raise HTTPException(400, "Produto já favoritado por esse Cliente")

    session.add(favorito_cadastro)
    session.commit()
    session.refresh(favorito_cadastro)

    return {"mensagem": "Produto adicionado aos favoritos", "Favorito": favorito_cadastro}

# ------------------------------------------------------------------------------
# DELETE

@router.delete("/{fav_id}")
def deleta_favoritos(session: SessionDep,fav_id:int):

    favorito_deletado = session.exec(
        select(Favorito).where(Favorito.id == fav_id)
    ).first()

    if not favorito_deletado:
        raise HTTPException(404, "Favorito não encontrado!")

    session.delete(favorito_deletado)
    session.commit()

    return {"mensagem": "Favorito deletado com sucesso!"}