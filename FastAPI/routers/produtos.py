from models import  Produto, Categoria, Favorito, Carrinho, Comentario
from config import engine
from sqlmodel import Session, select
from fastapi import HTTPException, Depends, APIRouter, UploadFile, Form
from typing import Annotated
from datetime import datetime
import os
from sqlalchemy.orm import selectinload






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


    query = select(Produto).options(selectinload(Produto.categoria),
                                    selectinload(Produto.comentarios),
                                    selectinload(Produto.favoritos),
                                    selectinload(Produto.carrinhos),
                                    selectinload(Produto.compras),
                                    selectinload(Produto.loja))


    if loj_id:
        query = query.where(Produto.loja_id == loj_id)
        produtos = session.exec(query).all()
        if not produtos:
           raise HTTPException(404, "Loja sem Produtos")
    if pro_id:
        query = query.where(Produto.id == pro_id)
        produtos = session.exec(query).all()
        if not produtos:
           raise HTTPException(404, "id do produto inexistente")
    if pro_nome:
        query = query.where(Produto.nome.contains(pro_nome))
        produtos = session.exec(query).all()
        if not produtos:
           raise HTTPException(404, "nome inexistente")
    if pro_categoria:
        categoria = session.exec(select(Categoria).where(Categoria.nome == pro_categoria)).first()
        query = query.where(Produto.categoria_id == categoria.id)
        produtos = session.exec(query).all()
        if not produtos:
           raise HTTPException(404, "categoria inexistente")
       
    produtos = session.exec(query).all()




    resultado = []
    for c in produtos:
        resultado.append({
            **c.model_dump(),
            "categoria": c.categoria.model_dump() if c.categoria else None,
            "comentarios": [come.model_dump() for come in c.comentarios] if c.comentarios else [],
            "favoritos": [f.model_dump() for f in c.favoritos] if c.favoritos else [],
            "carrinhos": [car.model_dump() for car in c.carrinhos] if c.carrinhos else [],
            "compras": [comp.model_dump() for comp in c.compras] if c.compras else [],
            "loja": c.loja.model_dump() if c.loja else None,
        })

    return resultado
   


# ------------------------------------------------------------------------------
# CADASTRO
@router.post("/")
async def cadastra_produto(session: SessionDep, pro_preco:float=Form(None),pro_nome:str=Form(None), pro_categoria:str=Form(None), pro_estoque:int=Form(None), pro_imagem:UploadFile =Form(None), pro_promocao:int = Form(None), pro_loja_id:int = Form(None)):
   
        UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "..", "uploads")
        os.makedirs(UPLOAD_DIR, exist_ok=True)


        produto_existente = session.exec(
            select(Produto).where(Produto.nome == pro_nome, Produto.loja_id == pro_loja_id)
        ).first()


        if produto_existente:
            raise HTTPException(status_code=400, detail="Nome já cadastrado nessa loja")


       
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        filename = f"{timestamp}_{pro_imagem.filename}"
        file_path = os.path.join(UPLOAD_DIR, filename)


        with open(file_path, "wb") as buffer:
            buffer.write(await pro_imagem.read())


        file_url = f"/uploads/{filename}"


        novo_produto = Produto(
            nome=pro_nome,
            preco=pro_preco,
            estoque=pro_estoque,
            categoria_id=pro_categoria,
            loja_id=pro_loja_id,
            promocao=pro_promocao,
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
    
     # ================================
    #  DELETE DEPENDÊNCIAS MANUALMENTE
    # ================================
    # Carrinho
    carrinhos = session.exec(
        select(Carrinho).where(Carrinho.produto_id == pro_id)
    ).all()
    for c in carrinhos:
        session.delete(c)

    # Favoritos
    favoritos = session.exec(
        select(Favorito).where(Favorito.produto_id == pro_id)
    ).all()
    for f in favoritos:
        session.delete(f)

    # Comentários (exemplo)
    comentarios = session.exec(
        select(Comentario).where(Comentario.produto_id == pro_id)
    ).all()
    for cm in comentarios:
        session.delete(cm)

    session.commit()
   
    UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "..", "uploads")
    os.makedirs(UPLOAD_DIR, exist_ok=True)

    # Caminho absoluto do arquivo antigo
    old_image_path = os.path.join(
        UPLOAD_DIR,
        produto.imagem_path.replace("/uploads/", "")
    )

    # Deleta se existir
    if os.path.exists(old_image_path):
        os.remove(old_image_path)


    session.delete(produto)
    session.commit()


    return {"mensagem": "Produto deletado com sucesso"}


# ------------------------------------------------------------------------------
# UPDATE
@router.put("/{pro_id}")
async def atualiza_produto(session: SessionDep,pro_id:int,pro_preco:float=Form(None),pro_nome:str=Form(None), pro_categoria:str=Form(None), pro_estoque:int=Form(None), pro_imagem:UploadFile =Form(None), pro_promocao:int = Form(None), pro_compra:int = None):

    produto = session.get(Produto, pro_id)


    if not produto:
        raise HTTPException(404, "Produto não encontrado")
   


    if pro_nome:
        produto.nome = pro_nome
    if pro_categoria:
        categoria = session.exec(
                select(Categoria).where(Categoria.id == pro_categoria)
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
        # Diretório de uploads
        UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "..", "uploads")
        os.makedirs(UPLOAD_DIR, exist_ok=True)

        # Caminho absoluto do arquivo antigo
        old_image_path = os.path.join(
            UPLOAD_DIR,
            produto.imagem_path.replace("/uploads/", "")
        )

        # Deleta se existir
        if os.path.exists(old_image_path):
            os.remove(old_image_path)

        # Salvar nova imagem
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        filename = f"{timestamp}_{pro_imagem.filename}"
        file_path = os.path.join(UPLOAD_DIR, filename)

        with open(file_path, "wb") as buffer:
            buffer.write(await pro_imagem.read())

        # Caminho que vai para o front
        produto.imagem_path = f"/uploads/{filename}"




    session.add(produto)
    session.commit()
    session.refresh(produto)


    return {"mensagem": "Produto editado com sucesso", "produto": produto}

