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

    cliente.nome = dados_novos.nome
    cliente.email = dados_novos.email
    cliente.senha = dados_novos.senha


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

    loja_cadastra.senha = generate_password_hash(loja_cadastra.senha)

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

    loja.email = dados_novos.email
    loja.senha = dados_novos.senha
    loja.descricao = dados_novos.descricao


    session.add(loja)
    session.commit()
    session.refresh(loja)

    return {"mensagem": "Perfil editado com sucesso", "loja": loja}

#////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                        #Produto
#////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

# ------------------------------------------------------------------------------
@app.get("/loja/produtos")
def exibe_produtos(loja_id:int, session: SessionDep):

    produtos = session.exec(
        select(Produto).where(Produto.loja_id == loja_id)
    ).all()

    return produtos

# ------------------------------------------------------------------------------
@app.get("/loja/{produto_id}")
def exibe_produto(loja_id:int, session: SessionDep, produto_id:int):
    

    
    produto = session.exec(
        select(Produto).where(Produto.loja_id == loja_id, Produto.id == produto_id)
    ).first()

    return produto

# ------------------------------------------------------------------------------
# CADASTRO
@app.post("/loja/produtos")
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


    produto.nome = dados_novos.nome
    produto.categoria_id = dados_novos.categoria_id
    produto.estoque = dados_novos.estoque



    session.add(produto)
    session.commit()
    session.refresh(produto)

    return {"mensagem": "Produto editado com sucesso", "produto": produto}

# ------------------------------------------------------------------------------
#////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                        #Carrinho
#////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
# ------------------------------------------------------------------------------
# GET
@app.get("/carrinho/{cliente_id}")
def pega_carrinho(cliente_id:int, session: SessionDep):

    carrinho = session.exec(
        select(Carrinho).where(Carrinho.cliente_id == cliente_id)
    ).all()

    if not carrinho:
        raise HTTPException(400, "Carrinho do Cliente vazio")
    
    carrinho_total = session.exec(
        select(Carrinho, Produto).where(Carrinho.cliente_id == cliente_id, Produto.id == Carrinho.produto_id)
    )

    return carrinho_total
# ------------------------------------------------------------------------------
# POST
@app.post("/carrinho")
def coloca_carrinho(carrinho_cadastra:Carrinho, session:SessionDep):

    carrinho_existente = session.exec(
        select(Carrinho).where(Carrinho.produto_id == carrinho_cadastra.produto_id, Carrinho.cliente_id == carrinho_cadastra.cliente_id)
    ).first()

    if carrinho_existente:
        raise HTTPException(400, "Produto já está em seu carrinho")

    session.add(carrinho_cadastra)
    session.commit()
    session.refresh(carrinho_cadastra)

    return {"mensagem": "Produto colocado no carrinho com sucesso", "Produto Colocado": carrinho_cadastra}

# ------------------------------------------------------------------------------
# DELETE
@app.delete("/carrinho/{cliente_id}")
def deleta_carrinho(produto_id: int, session: SessionDep, cliente_id:int):
    carrinho_deletado = session.exec(
        select(Carrinho).where(Carrinho.produto_id == produto_id, Carrinho.cliente_id == cliente_id)
    )

    if not carrinho_deletado:
        raise HTTPException(404, "Produto não encontrado no carrinho desse Cliente")

    session.delete(carrinho_deletado)
    session.commit()

    return {"mensagem": "Produto deletado com sucesso desse carrinho"}

# ------------------------------------------------------------------------------
# PUT
@app.put("/carrinho/{cliente_id}")
def atualiza_carrinho(produto_id: int, session: SessionDep, cliente_id:int, quantidade_nova: int):

    carrinho_atualizar = session.exec(
        select(Carrinho).where(Carrinho.produto_id == produto_id, Carrinho.cliente_id == cliente_id)
    )

    if not carrinho_atualizar:
        raise HTTPException(404, "Produto não encontrado no carrinho desse Cliente")
    
    carrinho_atualizar.qnt_produto = quantidade_nova

    session.add(carrinho_atualizar)
    session.commit()
    session.refresh(carrinho_atualizar)

    return {"mensagem": "Carrinho editado com sucesso", "Quantidade Nova": quantidade_nova}

# ------------------------------------------------------------------------------
#////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                        #Carrinho
#////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
# ------------------------------------------------------------------------------
# GET
@app.get("/amigo/{cliente_id}")
def pega_amigos(cliente_id:int, session: SessionDep):

    amigos = session.exec(
        select(Amigo).where(Amigo.amigo_de == cliente_id)
    ).all()

    if not amigos:
        raise HTTPException(400, "Cliente sem amigos")
    
    lista = []

    for amigo in amigos:
        lista.append(amigo.amigo)

    return lista
# ------------------------------------------------------------------------------
# POST
@app.post("/amigo")
def adiciona_amigo(amigo:Amigo, session:SessionDep):

    amizade_existente = session.exec(
        select(Amigo).where(Amigo.amigo_de == amigo.amigo_de, Amigo.amigo == amigo.amigo)
    ).first()

    if amizade_existente:
        raise HTTPException(400, "Amizade já existe com esses usuários")

    amizade_inversa = Amigo(id=amigo.id+1, amigo=amigo.amigo_de, amigo_de=amigo.amigo)

    session.add(amigo)
    session.commit()
    session.refresh(amigo)

    session.add(amizade_inversa)
    session.commit()
    session.refresh(amizade_inversa)

    return {"mensagem": "Amizade cadastrada com sucesso", "Nova Amizade": amigo}

# ------------------------------------------------------------------------------
# DELETE
@app.delete("/amigo/{cliente_id}")
def desfaz_amizade(session: SessionDep, cliente_id:int, amigo_exclui:int):
    amigo_deletado = session.exec(
        select(Amigo).where(Amigo.amigo == produto_id, Carrinho.cliente_id == cliente_id)
    )

    if not carrinho_deletado:
        raise HTTPException(404, "Produto não encontrado no carrinho desse Cliente")

    session.delete(carrinho_deletado)
    session.commit()

    return {"mensagem": "Produto deletado com sucesso desse carrinho"}

# ------------------------------------------------------------------------------
# PUT



