from models import  Produto, Categoria
from config import engine
from sqlmodel import Session, select
from fastapi import HTTPException, Depends, APIRouter
from typing import Annotated


def get_session():
    with Session(engine) as session:
        yield session

SessionDep = Annotated[Session, Depends(get_session)]

router = APIRouter(prefix="/produtos", tags=["produtos"])


#////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                        #Produto
#////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

# ------------------------------------------------------------------------------
@router.get("/")
def busca_produto(session: SessionDep,loj_id:int=None, pro_id:int=None, pro_nome:str=None, pro_categoria:str=None):

    produtos = session.exec(select(Produto)).all()

    if loj_id:
        produtos = session.exec(
            select(Produto).where(Produto.loja_id == loj_id)
        ).all()
    if pro_id:
        produtos = session.exec(
            select(Produto).where(Produto.id == pro_id)
        ).all()
    if pro_nome:
        produtos = session.exec(
            select(Produto).where(Produto.nome.contains(pro_nome))
        ).all()
    if pro_categoria:
        produtos = session.exec(
            select(Produto, Categoria).where(Produto.categoria_id == Categoria.id, Categoria.nome == pro_categoria)
        ).all()


    return produtos

# ------------------------------------------------------------------------------
# CADASTRO
@router.post("/")
def cadastra_produto(produto_cadastra: Produto, session: SessionDep):

    produto_existente = session.exec(
        select(Produto).where(Produto.nome == produto_cadastra.nome, Produto.loja_id == produto_cadastra.loja_id)
    ).first()

    if produto_existente:
        raise HTTPException(400, "Nome já cadastrado nessa loja")

    session.add(produto_cadastra)
    session.commit()
    session.refresh(produto_cadastra)

    return {"mensagem": "Produto cadastrado com sucesso", "Produto": produto_cadastra}

# ------------------------------------------------------------------------------
# DELETE
@router.delete("/{pro_id}")
def deleta_produto(pro_id:int, session: SessionDep):
  
    produto = session.exec(
        select(Produto).where(Produto.id == pro_id)
    ).first()

    if not produto:
        raise HTTPException(404, "Produto não encontrado")

    session.delete(produto)
    session.commit()

    return {"mensagem": "Produto deletado com sucesso"}

# ------------------------------------------------------------------------------
# UPDATE
@router.put("/{pro_id}")
def atualiza_produto(session: SessionDep,pro_id:int,pro_preco:float=None,pro_nome:str=None, pro_categoria:str=None, pro_estoque:int=None, pro_imagem:bytes =None, pro_promocao:int = None, pro_compra:int = None):


    produto = session.get(Produto, pro_id)

    if not produto:
        raise HTTPException(404, "Produto não encontrado")
    

    if pro_nome:
        produto.nome = pro_nome
    if pro_categoria:
        categoria = session.exec(
                select(Categoria).where(Categoria.nome == pro_categoria)
            ).first()
        produto.categoria_id = categoria.id
    if pro_estoque:
        produto.estoque = pro_estoque
    if pro_imagem:
        produto.imagem = pro_imagem
    if pro_preco:
        produto.preco = pro_preco
    if pro_promocao:
        produto.promocao = pro_promocao
    if pro_compra:
        produto.com_id = pro_compra

    session.add(produto)
    session.commit()
    session.refresh(produto)

    return {"mensagem": "Produto editado com sucesso", "produto": produto}