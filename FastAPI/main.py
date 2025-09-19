from models import Categoria, Produto, Favorito, Cliente, Carrinho, Amigo, Loja, Comentario
from config import app, engine
from sqlmodel import SQLModel, Session, select
from fastapi import HTTPException, Depends
from typing import Annotated
from werkzeug.security import generate_password_hash, check_password_hash

def get_session():
    with Session(engine) as session:
        yield session

SessionDep = Annotated[Session, Depends(get_session)]

#////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                        #Clientes
#////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

# ------------------------------------------------------------------------------
# LOGIN
@app.get("/cliente")
def login_cliente(cli_email: str, cli_senha: str, session: SessionDep):
    cliente = session.exec(
        select(Cliente).where(Cliente.email == cli_email)
    ).first()

    if not cliente:
        raise HTTPException(404, "Email inexistente")

    if check_password_hash(cli_senha,cliente.senha):
        raise HTTPException(401, "Senha incorreta")

    return cliente

# ------------------------------------------------------------------------------
# CADASTRO
@app.post("/cliente")
def cadastra_cliente(cliente_cadastra: Cliente, session: SessionDep):
    # Verifica duplicidade
    cliente_existente = session.exec(
        select(Cliente).where(Cliente.email == cliente_cadastra.email)
    ).first()
    

    if cliente_existente:
        raise HTTPException(400, "Email já cadastrado")
    
    cliente_existente = session.exec(
        select(Cliente).where(Cliente.cpf == cliente_cadastra.cpf)
    ).first()

    if cliente_existente:
        raise HTTPException(400, "CPF já cadastrado")

    cliente_cadastra.senha = generate_password_hash(cliente_cadastra.senha)

    session.add(cliente_cadastra)
    session.commit()
    session.refresh(cliente_cadastra)

    return {"mensagem": "Perfil cadastrado com sucesso", "cliente": cliente_cadastra}

# ------------------------------------------------------------------------------
# DELETE
@app.delete("/cliente")
def deleta_cliente(cliente_id: int, session: SessionDep):

    cliente = session.get(Cliente, cliente_id)

    if not cliente:
        raise HTTPException(404, "Perfil não encontrado")

    session.delete(cliente)
    session.commit()

    return {"mensagem": "Perfil deletado com sucesso"}

# ------------------------------------------------------------------------------
# UPDATE
@app.put("/cliente")
def atualiza_cliente(dados_novos: Cliente, session: SessionDep):
    cliente = session.get(Cliente, dados_novos.id)

    if not cliente:
        raise HTTPException(404, "Perfil não encontrado")

    # Atualiza apenas os campos enviados
    cliente.nome = dados_novos.nome
    cliente.email = dados_novos.email
    cliente.senha = dados_novos.senha
    # se tiver outros atributos, atualize aqui...

    session.add(cliente)
    session.commit()
    session.refresh(cliente)

    return {"mensagem": "Perfil editado com sucesso", "cliente": cliente}


#////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                        #Loja
#////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

# ------------------------------------------------------------------------------
# LOGIN
@app.get("/loja")
def login_loja(loja_email: str, loja_senha: str, session: SessionDep):
    loja = session.exec(
        select(Loja).where(Loja.email == loja_email)
    ).first()

    if not loja:
        raise HTTPException(404, "Email inexistente")

    if check_password_hash(loja.senha, loja_senha):
        raise HTTPException(401, "Senha incorreta")

    return loja

# ------------------------------------------------------------------------------
# CADASTRO
@app.post("/loja")
def cadastra_loja(loja_cadastra: Loja, session: SessionDep):
    # Verifica duplicidade
    loja_existente = session.exec(
        select(Loja).where(Loja.email == loja_cadastra.email)
    ).first()

    if loja_existente:
        raise HTTPException(400, "Email já cadastrado")
    
    loja_existente = session.exec(
        select(Loja).where(Loja.cnpj == loja_cadastra.cnpj)
    ).first()

    if loja_existente:
        raise HTTPException(400, "CNPJ já cadastrado")

    

    session.add(loja_cadastra)
    session.commit()
    session.refresh(loja_cadastra)

    return {"mensagem": "Perfil cadastrado com sucesso", "loja": loja_cadastra}

# ------------------------------------------------------------------------------
# DELETE
@app.delete("/loja")
def deleta_loja(loja_id: int, session: SessionDep):
    loja = session.get(loja, loja_id)

    if not loja:
        raise HTTPException(404, "Perfil não encontrado")

    session.delete(loja)
    session.commit()

    return {"mensagem": "Perfil deletado com sucesso"}

# ------------------------------------------------------------------------------
# UPDATE
@app.put("/loja")
def atualiza_loja(dados_novos: Loja, session: SessionDep):
    loja = session.get(loja, dados_novos.id)

    if not loja:
        raise HTTPException(404, "Perfil não encontrada")

    # Atualiza apenas os campos enviados
    loja.email = dados_novos.email
    loja.senha = dados_novos.senha
    loja.descricao = dados_novos.descricao
    # se tiver outros atributos, atualize aqui...

    session.add(loja)
    session.commit()
    session.refresh(loja)

    return {"mensagem": "Perfil editado com sucesso", "loja": loja}

#////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                        #Produto
#////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

# ------------------------------------------------------------------------------
@app.get("/loja/produtos")
def exibe_produtos(loja_email: str, loja_senha: str, session: SessionDep):
    # Busca a loja pelo email
    loja = session.exec(
        select(Loja).where(Loja.email == loja_email)
    ).first()

    if not loja:
        raise HTTPException(404, "Email inexistente")

    if loja.senha != loja_senha:
        raise HTTPException(401, "Senha incorreta")

    # Consulta os produtos dessa loja
    produtos = session.exec(
        select(Produto).where(Produto.loja_id == loja.id)
    ).all()

    return {"loja": loja.email, "produtos": produtos}

# ------------------------------------------------------------------------------
@app.get("/loja/{produto_id}")
def exibe_produto(loja_email: str, loja_senha: str, session: SessionDep, produto_id:int):
    # Busca a loja pelo email
    loja = session.exec(
        select(Loja).where(Loja.email == loja_email)
    ).first()

    if not loja:
        raise HTTPException(404, "Email inexistente")

    if loja.senha != loja_senha:
        raise HTTPException(401, "Senha incorreta")

    # Consulta os produtos dessa loja
    produto = session.exec(
        select(Produto).where(Produto.loja_id == loja.id and Produto.id == produto_id)
    ).first()

    return {"loja": loja.id, "produto": produto}

# ------------------------------------------------------------------------------
# CADASTRO
@app.post("/loja/produtos")
def cadastra_produto(produto_cadastra: Produto, session: SessionDep):
    # Verifica duplicidade
    produto_existente = session.exec(
        select(Produto).where(Produto.nome == produto_cadastra.nome and Produto.loja_id == produto_cadastra.loja_id)
    ).first()

    if produto_existente:
        raise HTTPException(400, "Nome já cadastrado nessa loja")

    session.add(produto_cadastra)
    session.commit()
    session.refresh(produto_cadastra)

    return {"mensagem": "Produto cadastrado com sucesso", "loja": produto_cadastra.loja_id}

# ------------------------------------------------------------------------------
# DELETE
@app.delete("/loja/{produto_id}")
def deleta_produto(produto_id: int, session: SessionDep):
    produto = session.get(Produto, produto_id)

    if not produto:
        raise HTTPException(404, "Produto não encontrado")

    session.delete(produto)
    session.commit()

    return {"mensagem": "Produto deletado com sucesso"}

# ------------------------------------------------------------------------------
# UPDATE
@app.put("/loja/{produto_id}")
def atualiza_produto(dados_novos: Produto, session: SessionDep, produto_id:int):
    produto = session.get(Produto, produto_id)

    if not produto:
        raise HTTPException(404, "Produto não encontrado")

    # Atualiza apenas os campos enviados
    produto.nome = dados_novos.nome
    produto.categoria_id = dados_novos.categoria_id
    produto.estoque = dados_novos.estoque

    # se tiver outros atributos, atualize aqui...

    session.add(produto)
    session.commit()
    session.refresh(produto)

    return {"mensagem": "Produto editado com sucesso", "produto": produto}

# ------------------------------------------------------------------------------
#////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                        #Carrinho
#////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

@app.get("/carrinho/{cliente_id}")
def pega_carrinho(cliente_id:int, session: SessionDep):
    carrinho = session.exec(
        select(Carrinho).where(Carrinho.cliente_id == cliente_id)
    ).all()

    if not carrinho:
        raise HTTPException(400, "Cliente sem Carrinho")
    
    carrinho_total = session.exec(
        select(Carrinho, Produto).where(Carrinho.cliente_id == cliente_id, Produto.id == Carrinho.produto_id)
    )
