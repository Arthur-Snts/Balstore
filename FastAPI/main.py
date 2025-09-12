from models import Categoria, Produto, Favorito, Cliente, Carrinho, Amigo, Loja, Comentario
from config import app, engine
from sqlmodel import SQLModel, Session, select
from fastapi import HTTPException, Depends
from typing import Annotated

def get_session():
    with Session(engine) as session:
        yield session

SessionDep = Annotated[Session, Depends(get_session)]

#////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                        #Clientes
#////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

# ------------------------------------------------------------------------------
# LOGIN
@app.get("/clientes")
def login_clientes(cli_email: str, cli_senha: str, session: SessionDep):
    cliente = session.exec(
        select(Cliente).where(Cliente.email == cli_email)
    ).first()

    if not cliente:
        raise HTTPException(404, "Email inexistente")

    if cliente.senha != cli_senha:
        raise HTTPException(401, "Senha incorreta")

    return cliente

# ------------------------------------------------------------------------------
# CADASTRO
@app.post("/clientes")
def cadastra_cliente(cliente_cadastra: Cliente, session: SessionDep):
    # Verifica duplicidade
    cliente_existente = session.exec(
        select(Cliente).where(Cliente.email == cliente_cadastra.email)
    ).first()

    if cliente_existente:
        raise HTTPException(400, "Email já cadastrado")

    session.add(cliente_cadastra)
    session.commit()
    session.refresh(cliente_cadastra)

    return {"mensagem": "Perfil cadastrado com sucesso", "cliente": cliente_cadastra}

# ------------------------------------------------------------------------------
# DELETE
@app.delete("/clientes")
def deleta_cliente(cliente_id: int, session: SessionDep):
    cliente = session.get(Cliente, cliente_id)

    if not cliente:
        raise HTTPException(404, "Perfil não encontrado")

    session.delete(cliente)
    session.commit()

    return {"mensagem": "Perfil deletado com sucesso"}

# ------------------------------------------------------------------------------
# UPDATE
@app.put("/clientes")
def atualiza_cliente(dados_novos: Cliente, session: SessionDep):
    cliente = session.get(Cliente, dados_novos.id)

    if not cliente:
        raise HTTPException(404, "Perfil não encontrado")

    # Atualiza apenas os campos enviados
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
@app.get("/lojas")
def login_lojas(loja_email: str, loja_senha: str, session: SessionDep):
    loja = session.exec(
        select(loja).where(loja.email == loja_email)
    ).first()

    if not loja:
        raise HTTPException(404, "Email inexistente")

    if loja.senha != loja_senha:
        raise HTTPException(401, "Senha incorreta")

    return loja

# ------------------------------------------------------------------------------
# CADASTRO
@app.post("/lojas")
def cadastra_loja(loja_cadastra: Loja, session: SessionDep):
    # Verifica duplicidade
    loja_existente = session.exec(
        select(Loja).where(Loja.email == loja_cadastra.email)
    ).first()

    if loja_existente:
        raise HTTPException(400, "Email já cadastrado")

    session.add(loja_cadastra)
    session.commit()
    session.refresh(loja_cadastra)

    return {"mensagem": "Perfil cadastrado com sucesso", "loja": loja_cadastra}

# ------------------------------------------------------------------------------
# DELETE
@app.delete("/lojas")
def deleta_loja(loja_id: int, session: SessionDep):
    loja = session.get(loja, loja_id)

    if not loja:
        raise HTTPException(404, "Perfil não encontrado")

    session.delete(loja)
    session.commit()

    return {"mensagem": "Perfil deletado com sucesso"}

# ------------------------------------------------------------------------------
# UPDATE
@app.put("/lojas")
def atualiza_loja(dados_novos: Loja, session: SessionDep):
    loja = session.get(loja, dados_novos.id)

    if not loja:
        raise HTTPException(404, "Perfil não encontrada")

    # Atualiza apenas os campos enviados
    loja.email = dados_novos.email
    loja.senha = dados_novos.senha
    # se tiver outros atributos, atualize aqui...

    session.add(loja)
    session.commit()
    session.refresh(loja)

    return {"mensagem": "Perfil editado com sucesso", "loja": loja}

#////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                        #Produto
#////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

# ------------------------------------------------------------------------------
@app.get("/lojas/produtos")
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
@app.get("/lojas/{produto_id}")
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
# CADASTRO
@app.post("/lojas/produtos")
def cadastra_produto(produto_cadastra: Produto, session: SessionDep):
    # Verifica duplicidade
    produto_existente = session.exec(
        select(Produto).where(Produto.email == produto_cadastra.email)
    ).first()

    if produto_existente:
        raise HTTPException(400, "Email já cadastrado")

    session.add(produto_cadastra)
    session.commit()
    session.refresh(produto_cadastra)

    return {"mensagem": "Usuário cadastrado com sucesso", "loja": produto_cadastra}

# ------------------------------------------------------------------------------
# DELETE
@app.delete("/lojas/{produto_id}")
def deleta_produto(produto_id: int, session: SessionDep):
    produto = session.get(produto, produto_id)

    if not produto:
        raise HTTPException(404, "Produto não encontrado")

    session.delete(produto)
    session.commit()

    return {"mensagem": "Produto deletado com sucesso"}

# ------------------------------------------------------------------------------
# UPDATE
@app.put("/lojas/{produto_id}")
def atualiza_produto(dados_novos: Produto, session: SessionDep):
    produto = session.get(produto, dados_novos.id)

    if not produto:
        raise HTTPException(404, "Produto não encontrado")

    # Atualiza apenas os campos enviados
    produto.email = dados_novos.email
    produto.senha = dados_novos.senha
    # se tiver outros atributos, atualize aqui...

    session.add(produto)
    session.commit()
    session.refresh(produto)

    return {"mensagem": "Produto editado com sucesso", "produto": produto}