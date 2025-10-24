from models import  Produto, Categoria
from config import engine
from sqlmodel import Session, select
from fastapi import HTTPException, Depends, APIRouter, UploadFile
from typing import Annotated
from datetime import datetime
import os



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
async def cadastra_produto(nome: str , preco: float, estoque: int, categoria_id: int, loja_id: int, promocao: int, imagem: UploadFile, session: SessionDep):
    
        UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "..", "uploads")
        os.makedirs(UPLOAD_DIR, exist_ok=True)

        produto_existente = session.exec(
            select(Produto).where(Produto.nome == nome, Produto.loja_id == loja_id)
        ).first()

        if produto_existente:
            raise HTTPException(status_code=400, detail="Nome já cadastrado nessa loja")

       
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        filename = f"{timestamp}_{imagem.filename}"
        file_path = os.path.join(UPLOAD_DIR, filename)

        with open(file_path, "wb") as buffer:
            buffer.write(await imagem.read())

        file_url = f"../../../../../FastAPI/uploads/{filename}"

        novo_produto = Produto(
            nome=nome,
            preco=preco,
            estoque=estoque,
            categoria_id=categoria_id,
            loja_id=loja_id,
            promocao=promocao,
            imagem_path=file_url 
        )

        session.add(novo_produto)
        session.commit()
        session.refresh(novo_produto)

        return {
            "mensagem": "Produto cadastrado com sucesso!",
            "produto": novo_produto
        }

# ------------------------------------------------------------------------------
# DELETE
@router.delete("/{pro_id}")
def deleta_produto(pro_id:int, session: SessionDep):
  
    produto = session.exec(
        select(Produto).where(Produto.id == pro_id)
    ).first()

    if not produto:
        raise HTTPException(404, "Produto não encontrado")
    
    produto.imagem_path = produto.imagem_path.split("FastAPI/")[-1]
    os.remove(produto.imagem_path)

    session.delete(produto)
    session.commit()

    


    return {"mensagem": "Produto deletado com sucesso"}

# ------------------------------------------------------------------------------
# UPDATE
@router.put("/{pro_id}")
async def atualiza_produto(session: SessionDep,pro_id:int,pro_preco:float=None,pro_nome:str=None, pro_categoria:str=None, pro_estoque:int=None, pro_imagem:UploadFile =None, pro_promocao:int = None, pro_compra:int = None):


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
    if pro_preco:
        produto.preco = pro_preco
    if pro_promocao:
        produto.promocao = pro_promocao
    if pro_compra:
        produto.com_id = pro_compra
    if pro_imagem:
        produto.imagem_path = produto.imagem_path.split("FastAPI/")[-1]
        os.remove(produto.imagem_path)
        UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "..", "uploads")
        os.makedirs(UPLOAD_DIR, exist_ok=True)
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        filename = f"{timestamp}_{pro_imagem.filename}"
        file_path = os.path.join(UPLOAD_DIR, filename)
        with open(file_path, "wb") as buffer:
            buffer.write(await pro_imagem.read())

        file_url = f"../../../../../FastAPI/uploads/{filename}"

        produto.imagem_path = file_url


    session.add(produto)
    session.commit()
    session.refresh(produto)

    return {"mensagem": "Produto editado com sucesso", "produto": produto}