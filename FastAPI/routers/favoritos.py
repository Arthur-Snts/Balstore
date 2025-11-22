from models import Favorito, Cliente
from config import engine
from sqlmodel import Session, select
from fastapi import HTTPException, Depends, APIRouter
from typing import Annotated
from sqlalchemy.orm import selectinload


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
    
    query = select(Favorito).options(selectinload(Favorito.cliente), 
                                    selectinload(Favorito.produto),)


    if fav_id:
        query = query.where(Favorito.produto_id == cli_id)

    if cli_id:
        query = query.where(Favorito.cliente_id == cli_id)

    favoritos = session.exec(query).all()

    resultado = []
    for c in favoritos:
        resultado.append({
            **c.model_dump(),
            "produto": c.produto.model_dump() if c.produto else None,
            "cliente": c.cliente.model_dump() if c.cliente else None,
            })
    if len(resultado) ==1:
        return resultado[0]
    else:
        return resultado

# ------------------------------------------------------------------------------
# POST

@router.post("/")
def cadastra_favoritos(session: SessionDep, favorito_cadastro:Favorito):

    favorito_existente = session.exec(
        select(Favorito).where(Favorito.cliente_id == favorito_cadastro.cliente_id, Favorito.produto_id == favorito_cadastro.produto_id)
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
