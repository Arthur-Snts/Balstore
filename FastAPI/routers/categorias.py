from models import  Categoria
from config import  engine
from sqlmodel import Session, select
from fastapi import HTTPException, Depends, APIRouter
from typing import Annotated


def get_session():
    with Session(engine) as session:
        yield session

SessionDep = Annotated[Session, Depends(get_session)]


router = APIRouter(prefix="/categorias", tags=["categorias"])



# ------------------------------------------------------------------------------
#////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                        #Categoria
#////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
# ------------------------------------------------------------------------------
# GET

@router.get("/")
def pega_categorias( session: SessionDep, cat_id:int = None):

    categorias = session.exec(
        select(Categoria)
    ).all()

    if cat_id:
        categoria = session.exec(
            select(Categoria).where(Categoria.id == cat_id)
        ).first()
        return categoria

    return categorias
# ------------------------------------------------------------------------------
# POST

@router.post("/")
def cadastra_categoria( session:SessionDep, categoria:Categoria):

    categoria_existente = session.exec(
        select(Categoria).where(Categoria.nome == categoria.nome)
    ).first()

    if categoria_existente:
        raise HTTPException(400, "Categoria já existe com esse nome")

    session.add(categoria)
    session.commit()
    session.refresh(categoria)

    return {"mensagem": "Categoria cadastrada com sucesso", "Categoria": categoria}

# ------------------------------------------------------------------------------
# DELETE

@router.delete("/{cat_id}")
def deleta_categoria(session: SessionDep, cat_id:int):

    categoria_deletada = session.exec(
        select(Categoria).where(Categoria.id == cat_id)
    ).first()

    if not categoria_deletada:
        raise HTTPException(404, "Categoria não Encontrada")

    session.delete(categoria_deletada)
    session.commit()

    return {"mensagem": "Categoria deletada com sucesso"}
