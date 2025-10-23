from models import  Produto, Categoria
from config import engine
from sqlmodel import Session, select
from fastapi import HTTPException, Depends, APIRouter, UploadFile, File, Form
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
# baixar arquivo (ex degravacao) e armazenar imagem numa pasta e armazenar o nome
@router.post("/")
async def cadastra_produto(
    nome: str = Form(...),
    preco: float = Form(...),
    estoque: int = Form(...),
    categoria_id: int = Form(...),
    loja_id: int = Form(...),
    promocao: int = Form(...),
    imagem: UploadFile = File(...),
    session: SessionDep = None
):
    try:
        # Caminho da pasta "uploads" (criada dentro da pasta FastAPI)
        UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "..", "uploads")
        os.makedirs(UPLOAD_DIR, exist_ok=True)

        # Verifica se o produto já existe na loja
        produto_existente = session.exec(
            select(Produto).where(Produto.nome == nome, Produto.loja_id == loja_id)
        ).first()

        if produto_existente:
            raise HTTPException(status_code=400, detail="Nome já cadastrado nessa loja")

        # Gera um nome único para a imagem
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        filename = f"{timestamp}_{imagem.filename}"
        file_path = os.path.join(UPLOAD_DIR, filename)

        # Salva o arquivo fisicamente
        with open(file_path, "wb") as buffer:
            buffer.write(await imagem.read())

        file_url = f"../../../../../FastAPI/uploads/{filename}"

        # Cria o produto no banco com o nome do arquivo salvo
        novo_produto = Produto(
            nome=nome,
            preco=preco,
            estoque=estoque,
            categoria_id=categoria_id,
            loja_id=loja_id,
            promocao=promocao,
            imagem=file_url  # salva só o nome do arquivo
        )
        print (file_url)

        session.add(novo_produto)
        session.commit()
        session.refresh(novo_produto)

        return {
            "mensagem": "Produto cadastrado com sucesso!",
            "produto": novo_produto
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

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