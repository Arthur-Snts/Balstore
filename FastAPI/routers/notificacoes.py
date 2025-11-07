from models import Notificacao
from config import engine
from sqlmodel import Session, select
from fastapi import HTTPException, Depends, APIRouter
from typing import Annotated

def get_session():
    with Session(engine) as session:
        yield session

SessionDep = Annotated[Session, Depends(get_session)]

router = APIRouter(prefix="/notificacoes", tags=["notificacoes"])


# ------------------------------------------------------------------------------
#////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                        #Notificação
#////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
# ------------------------------------------------------------------------------
# GET
@router.get("/{loj_id}")
def pega_notificacao(session: SessionDep, loj_id:int, not_id:int = None):

    notificacoes = session.exec(
        select(Notificacao).where(Notificacao.loj_id == loj_id)
    ).all()

    if not notificacoes:
        raise HTTPException(400, "Loja sem Notificação")
    
    if not_id:
        notificacao = session.exec(select(Notificacao).where(Notificacao.id == not_id)).first()
        if not notificacao:
            raise HTTPException(400, "Notificação não encontrada")
        return notificacao

    return notificacoes

# ------------------------------------------------------------------------------
# POST

@router.post("/{loj_id}")
def cadastra_notificacao(session: SessionDep, notificacao_cadastra:Notificacao):

    notificacao_existente = session.exec(
        select(Notificacao).where(Notificacao.cliente_id == notificacao_cadastra.cliente_id, Notificacao.loj_id == notificacao_cadastra.loj_id, Notificacao.produto_id == notificacao_cadastra.produto_id)
    ).first()

    if notificacao_existente:
        raise HTTPException(400, "Notificação já existente")

    session.add(notificacao_cadastra)
    session.commit()
    session.refresh(notificacao_cadastra)

    return {"mensagem": "Notificacao cadastrada com sucesso", "Notificacao": notificacao_cadastra}

# ------------------------------------------------------------------------------
# PUT

@router.put("/{not_id}")
def atualiza_notificacao(session: SessionDep, status_novo: str, not_id: int):

    notificacao_existente = session.exec(
        select(Notificacao).where(Notificacao.id == not_id)
    ).first()

    if not notificacao_existente:
        raise HTTPException(400, "Notificação não encontrada")
    
    notificacao_existente.status = status_novo

    session.add(notificacao_existente)
    session.commit()
    session.refresh(notificacao_existente)

    return {"mensagem": "Notificacao atualizada com sucesso", "Notificacao": notificacao_existente}

# ------------------------------------------------------------------------------
# DELETE

@router.delete("/{not_id}")
def deleta_notificacao(session:SessionDep, not_id:int):

    notificacao = session.exec(
        select(Notificacao).where(Notificacao.id == not_id)
    ).first()

    session.delete(notificacao)
    session.commit()

    return {"mensagem" : "Notificação deletada com sucesso"}