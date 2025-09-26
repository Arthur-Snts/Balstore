from models import Categoria, Produto, Favorito, Cliente, Carrinho, Amigo, Loja, Comentario, Endereco
from config import app, engine
from sqlmodel import SQLModel, Session, select
from fastapi import HTTPException, Depends
from typing import Annotated
from sqlalchemy import LargeBinary
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
def busca_cliente(cli_email: str = None, cli_senha: str = None, session: SessionDep = Depends(get_session), cli_nome:str=None, cli_cpf:str=None):

    if cli_email and cli_senha:

        cliente = session.exec(
            select(Cliente).where(Cliente.email == cli_email)
        ).first()

        if not cliente:
            raise HTTPException(404, "Email inexistente")

        if not check_password_hash(cli_senha,cliente.senha):
            raise HTTPException(401, "Senha incorreta")
    
    if cli_email:
        cliente = session.exec(
            select(Cliente).where(Cliente.email == cli_email)
        ).first()

    if cli_nome:
        cliente = session.exec(
            select(Cliente).where(Cliente.nome.contains(cli_nome))
        ).all()

    if cli_cpf:
        cliente = session.exec(
            select(Cliente).where(Cliente.cpf == cli_cpf)
        ).first()


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
def deleta_cliente(cli_id: int, session: SessionDep):
    
    cliente = session.get(Cliente, cli_id)

    if not cliente:
        raise HTTPException(404, "Perfil não encontrado")

    session.delete(cliente)
    session.commit()

    return {"mensagem": "Perfil deletado com sucesso"}

# ------------------------------------------------------------------------------
# UPDATE
@app.put("/cliente/{cli_id}")
def atualiza_cliente(cli_id:int,cli_nome:str=None, cli_email:str=None, cli_senha:str=None, session: SessionDep = Depends(get_session)):

    cliente = session.get(Cliente, cli_id)
    
    if not cliente:
        raise HTTPException(404, "Perfil não encontrado pelo ID, Verifique a informação.")

    cliente.nome = cli_nome
    cliente.email = cli_email
    cliente.senha = generate_password_hash(cli_senha)

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
def busca_loja(loj_email: str = None, loj_senha: str=None, session: SessionDep= Depends(get_session), loj_nome:str=None, loj_cnpj:str = None, loj_id:id = None):

    if loj_email and loj_senha:
        loja = session.exec(
            select(Loja).where(Loja.email == loj_email)
        ).first()

        if not loja:
            raise HTTPException(404, "Email inexistente")

        if check_password_hash(loja.senha, loj_senha):
            raise HTTPException(401, "Senha incorreta")
    if loj_email:
        loja = session.exec(
            select(Loja).where(Loja.email == loj_email)
        ).first()   
    if loj_nome:
        loja = session.exec(
            select(Loja).where(Loja.nome.contains(loj_nome))
        ).all()
    if loj_cnpj:
        loja = session.exec(
            select(Loja).where(Loja.cnpj == loj_cnpj)
        ).first()
    if loj_id:
        loja = session.exec(
            select(Loja).where(Loja.id == loj_id)
        ).first()

    return loja

# ------------------------------------------------------------------------------
# CADASTRO
@app.post("/loja")
def cadastra_loja(loja_cadastra: Loja, session: SessionDep = Depends(get_session)):

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
@app.delete("/loja/{loj_id}")
def deleta_loja(loj_id: int, session: SessionDep):
    
    loja = session.get(Loja, loj_id)

    if not loja:
        raise HTTPException(404, "Loja não encontrada")

    session.delete(loja)
    session.commit()

    return {"mensagem": "Loja deletada com sucesso"}

# ------------------------------------------------------------------------------
# UPDATE
@app.put("/loja/{loj_id}")
def atualiza_loja(loj_id:int,loj_nome:str=None, loj_email:str=None, loj_senha:str=None, session: SessionDep = Depends(get_session)):

    loja = session.get(loja, loj_id)
    
    if not loja:
        raise HTTPException(404, "Loja não encontrada pelo ID, Verifique a informação.")

    loja.nome = loj_nome
    loja.email = loj_email
    loja.senha = generate_password_hash(loj_senha)

    session.add(loja)
    session.commit()
    session.refresh(loja)

    return {"mensagem": "Perfil editado com sucesso", "loja": loja}

#////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                        #Produto
#////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

# ------------------------------------------------------------------------------
@app.get("/produto")
def busca_produto(loj_id:int=None, pro_id:int=None, pro_nome:str=None, pro_categoria:str=None, session: SessionDep = Depends(get_session)):

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
@app.post("/produto")
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
@app.delete("/produto/{pro_id}")
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
@app.put("/produto/{pro_id}")
def atualiza_produto(pro_id:int,pro_preco:float=None,pro_nome:str=None, pro_categoria:str=None, pro_estoque:int=None, pro_imagem:LargeBinary =None, session: SessionDep = Depends(get_session)):


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
@app.get("/carrinho/{cli_id}")
def pega_carrinho(cli_id:int, session: SessionDep = Depends(get_session)):

    carrinho = session.exec(
        select(Carrinho).where(Carrinho.cliente_id == cli_id)
    ).all()

    carrinho_total = session.exec(
        select(Carrinho, Produto).where(Carrinho.cliente_id == cli_id, Produto.id == Carrinho.produto_id)
    ).all()

    if not carrinho:
        raise HTTPException(400, "Carrinho do Cliente vazio")
    
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
@app.delete("/carrinho")
def deleta_carrinho(pro_id: int, session: SessionDep, cli_id:int):

    carrinho_deletado = session.exec(
        select(Carrinho).where(Carrinho.produto_id == pro_id, Carrinho.cliente_id == cli_id)
    ).first()

    if not carrinho_deletado:
        raise HTTPException(404, "Produto não encontrado no carrinho desse Cliente")

    session.delete(carrinho_deletado)
    session.commit()

    return {"mensagem": "Produto deletado com sucesso desse carrinho"}

# ------------------------------------------------------------------------------
# PUT
@app.put("/carrinho/{cli_id}")
def atualiza_carrinho(qnt_nova: int, pro_id: int, session: SessionDep, cli_id:int):


    carrinho_atualizar = session.exec(
        select(Carrinho).where(Carrinho.produto_id == pro_id, Carrinho.cliente_id == cli_id)
    ).first()

    if not carrinho_atualizar:
        raise HTTPException(404, "Produto não encontrado no carrinho desse Cliente")

    carrinho_atualizar.qnt_produto = qnt_nova

    session.add(carrinho_atualizar)
    session.commit()
    session.refresh(carrinho_atualizar)

    return {"mensagem": "Carrinho editado com sucesso", "Quantidade Nova": qnt_nova}

# ------------------------------------------------------------------------------
#////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                        #Amigo
#////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
# ------------------------------------------------------------------------------
# GET
@app.get("/amigo/{cli_id}")
def pega_amigos(cli_id:int, session: SessionDep):


   
    amigos = session.exec(
        select(Amigo, Cliente).where(Amigo.amigo_de == cli_id, Cliente.id == Amigo.amigo)
    ).all()

    if not amigos:
        raise HTTPException(400, "Cliente sem amigos")
    
    lista = []

    for amigo in amigos:
        lista.append(amigo.amigo)

    return lista
# ------------------------------------------------------------------------------
# POST
@app.post("/amigo/{cli_id}")
def adiciona_amigo(amigo:Amigo, session:SessionDep, cli_id:int):

    amizade_existente = session.exec(
        select(Amigo).where(Amigo.amigo_de == cli_id, Amigo.amigo == amigo.amigo)
    ).first()

    if amizade_existente:
        raise HTTPException(400, "Amizade já existe com esses usuários")

    amizade_inversa = Amigo(id=amigo.id+1, amigo=cli_id, amigo_de=amigo.amigo)

    session.add(amigo)
    session.commit()
    session.refresh(amigo)

    session.add(amizade_inversa)
    session.commit()
    session.refresh(amizade_inversa)

    return {"mensagem": "Amizade cadastrada com sucesso", "Nova Amizade": amigo}

# ------------------------------------------------------------------------------
# DELETE
@app.delete("/amigo/{cli_id}")
def desfaz_amizade(session: SessionDep, cli_id:int, amigo_exclui:int):
    amigo_deletado = session.exec(
        select(Amigo).where(Amigo.amigo == amigo_exclui, Amigo.amigo_de == cli_id)
    ).first()

    if not amigo_deletado:
        raise HTTPException(404, "Amigo não encontrado nas amizades desse Cliente")

    session.delete(amigo_deletado)
    session.commit()

    return {"mensagem": "Amigo deletado com sucesso desse Cliente"}

# ------------------------------------------------------------------------------
# PUT
@app.put("/amigo/{cli_id}")
def atualiza_amizade(session: SessionDep, cli_id:int, status_novo:str, amigo_id:int):
    amigo_atualizar = session.exec(
        select(Amigo).where(Amigo.amigo == amigo_id, Amigo.amigo_de == cli_id)
    ).first()

    if not amigo_atualizar:
        raise HTTPException(404, "Amigo não encontrado nas amizades desse Cliente")
    
    amigo_atualizar.solicitacao = status_novo

    session.add(amigo_atualizar)
    session.commit()
    session.refresh(amigo_atualizar)

    return {"mensagem": "Amigo atualizado com sucesso desse Cliente"}

# ------------------------------------------------------------------------------
#////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                        #Endereço
#////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
# ------------------------------------------------------------------------------
# GET
@app.get("/endereco")
def pega_enderecos(session: SessionDep, cli_id:int = None,loj_id:int = None):

    if loj_id:
        enderecos = session.exec(
            select(Endereco).where(Endereco.loj_id == loj_id)
        ).first()

        if not enderecos:
            raise HTTPException(400, "Loja sem Endereço")

    if cli_id:
        enderecos = session.exec(
            select(Endereco).where(Endereco.cli_id == cli_id)
        ).all()

        if not enderecos:
            raise HTTPException(400, "Cliente sem Enderecos")

    return enderecos

# ------------------------------------------------------------------------------
# POST

@app.post("/endereco")
def cadastra_enderecos(session: SessionDep, endereco:Endereco):

    if endereco.cli_id:
        endereco_existente = session.exec(
            select(Endereco).where(Endereco.cli_id == endereco.cli_id, Endereco.rua == endereco.rua, Endereco.numero == endereco.numero)
        ).first()

        if endereco_existente:
            raise HTTPException(400, "Endereços já cadastrado nesse Cliente")
    if endereco.loj_id:
        endereco_existente = session.exec(
            select(Endereco).where(Endereco.loj_id == endereco.loj_id, Endereco.rua == endereco.rua, Endereco.numero == endereco.numero)
        ).first()

        if endereco_existente:
            raise HTTPException(400, "Endereços já cadastrado nessa Loja")

    session.add(endereco)
    session.commit()
    session.refresh(endereco)

    return {"mensagem": "Endereço cadastrado com Sucesso", "Endereco": endereco}

# ------------------------------------------------------------------------------
# PUT
@app.put("/endereco")
def atualiza_endereco(session: SessionDep,end_id:int, rua: str =None, numero: str = None, bairro: str = None, cidade: str = None, estado:str = None, CEP:str = None):
    
    endereco_atualizar = session.exec(
        select(Endereco).where(Endereco.id == end_id)
    ).first()

    if not endereco_atualizar:
        raise HTTPException(404, "Endereço não encontrado")
    
    if rua:
        endereco_atualizar.rua = rua
    if numero:
        endereco_atualizar.numero = numero 
    if bairro:
        endereco_atualizar.bairro = bairro 
    if cidade:
        endereco_atualizar.cidade = cidade 
    if estado:
        endereco_atualizar.estado = estado 
    if CEP:
        endereco_atualizar.CEP = CEP 

    session.add(endereco_atualizar)
    session.commit()
    session.refresh(endereco_atualizar)

    return {"mensagem": "Endereço atualizado com sucesso!"}

# ------------------------------------------------------------------------------
# DELETE

@app.delete("/endereco")
def deleta_enderecos(session: SessionDep,end_id:int):

    endereco_deletado = session.exec(
        select(Endereco).where(Endereco.id == end_id)
    ).first()

    if not endereco_deletado:
        raise HTTPException(404, "Endereço não encontrado!")

    session.delete(endereco_deletado)
    session.commit()

    return {"mensagem": "Endereço deletado com sucesso!"}
