from models import  Comentario
from config import engine
from sqlmodel import Session, select
from fastapi import HTTPException, Depends, APIRouter
from typing import Annotated


def get_session():
    with Session(engine) as session:
        yield session

SessionDep = Annotated[Session, Depends(get_session)]

router = APIRouter(prefix="/comentarios", tags=["comentarios"])


# ------------------------------------------------------------------------------
#////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                        #Comentários
#////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
# ------------------------------------------------------------------------------
# GET
@router.get("/{pro_id}")
def pega_comentarios(session: SessionDep, pro_id:int, cli_id:int = None):

    comentarios = session.exec(
        select(Comentario).where(Comentario.produto_id == pro_id)
    ).all()

    if not comentarios:
        raise HTTPException(400, "Produto sem Comentários")
    
    if cli_id:
        comentarios = session.exec(
            select(Comentario).where(Comentario.produto_id == pro_id, Comentario.cliente_id == cli_id)
        ).first()

    return comentarios

# ------------------------------------------------------------------------------
# POST

@router.post("/")
def cadastra_comentarios(session: SessionDep, comentario_cadastro:Comentario):

    comentario_existente = session.exec(
        select(Comentario).where(Comentario.produto_id == comentario_cadastro.produto_id, Comentario.cliente_id == comentario_cadastro.cliente_id)
    ).first()

    if comentario_existente:
        raise HTTPException(400, "Produto já comentado por esse Cliente")

    session.add(comentario_cadastro)
    session.commit()
    session.refresh(comentario_cadastro)

    return {"mensagem": "Comentário adicionado ao Produto", "comentario": comentario_cadastro}

# ------------------------------------------------------------------------------
# DELETE

@router.delete("/{com_id}")
def deleta_comentarios(session: SessionDep,com_id:int):

    comentario_deletado = session.exec(
        select(Comentario).where(Comentario.id == com_id)
    ).first()

    if not comentario_deletado:
        raise HTTPException(404, "Comentario não encontrado!")

    session.delete(comentario_deletado)
    session.commit()

    return {"mensagem": "Comentario deletado com sucesso!"}

# ------------------------------------------------------------------------------
# PUT

@router.put("/{com_id}")
def atualiza_comentario(session: SessionDep,com_id:int, conteudo: str =None, avaliacao: int = None):
    
    comentario_atualizar = session.exec(
        select(Comentario).where(Comentario.id == com_id)
    ).first()

    if not comentario_atualizar:
        raise HTTPException(404, "Comentario não encontrado")
    
    if conteudo:
        comentario_atualizar.conteudo = conteudo
    if avaliacao:
        comentario_atualizar.avaliacao = avaliacao 

    session.add(comentario_atualizar)
    session.commit()
    session.refresh(comentario_atualizar)

    return {"mensagem": "Comentario atualizado com sucesso!"}