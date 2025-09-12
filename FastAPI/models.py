from sqlmodel import SQLModel, Field


class Categoria(SQLModel, table=True):
    id: int = Field(primary_key=True)
    nome: str = Field(index=True)

class Produto(SQLModel, table=True):
    id: int = Field(primary_key=True)
    nome: str = Field(index=True)
    categoria_id: str = Field(index=False)
    estoque: int = Field(index=False)
    loja_id: int = Field(index=False)

class Favorito(SQLModel, table= True):
    id: int = Field(primary_key=True)
    produto_id: int = Field(index=False)
    cliente_id: int = Field(index=False)

class Cliente(SQLModel, table=True):
    id: int = Field(primary_key=True)
    nome: str = Field(index=False)
    cpf: str = Field(index=False)
    email: str = Field(index=False)
    senha: str = Field(index=False)

class Carrinho(SQLModel, table=True):
    id: int = Field(primary_key=True)
    cliente_id: int = Field(index=False)
    produto_id: int = Field(index=False)
    qnt_produto: int = Field(index=False)

class Amigo(SQLModel, table=True):
    id:int = Field(primary_key=True)
    amigo_de: int = Field(index=False)
    amigo: int = Field(index=False)
    solicitação: str = Field(index=False)

class Loja(SQLModel, table=True):
    id:int = Field(primary_key=True)
    nome: int = Field(index=False)
    cnpj: str = Field(index=False)
    senha: str = Field(index=False)
    descricao: str = Field(index=False)

class Comentario(SQLModel, table=True):
    id:int = Field(primary_key=True)
    conteudo: str | None = Field(index=False)
    avaliacao: int = Field(index=False)
    cliente_id: int = Field(index=False)
    produto_id: int = Field(index=False)






    







