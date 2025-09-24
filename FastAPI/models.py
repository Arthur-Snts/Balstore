from typing import Optional
from sqlmodel import SQLModel, Field, Relationship
from sqlalchemy import LargeBinary, Column, String


class Categoria(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    nome: str = Field(index=False)

    produtos: list["Produto"] = Relationship(back_populates="categoria")


class Loja(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    nome: str = Field(index=False)
    cnpj: str = Field(index=False, unique=True)
    senha: str = Field(index=False)  
    descricao: Optional[str] = Field(default=None, index=False)

    produtos: list["Produto"] = Relationship(back_populates="loja")


class Produto(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    nome: str = Field(index=False)
    estoque: int = Field(default=0, index=False)
    imagem: bytes = Field(sa_column=Column(LargeBinary), index=False)

    categoria_id: int = Field(foreign_key="categoria.id")
    categoria: "Categoria" = Relationship(back_populates="produtos")

    loja_id: int = Field(foreign_key="loja.id")
    loja: "Loja" = Relationship(back_populates="produtos")

    
    comentarios: list["Comentario"] = Relationship(back_populates="produto")
    favoritos: list["Favorito"] = Relationship(back_populates="produto")
    carrinhos: list["Carrinho"] = Relationship(back_populates="produto")





class Cliente(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    nome: str = Field(index=False)
    cpf: str = Field(index=False, unique=True)
    email: str = Field(index=False, unique=True)
    senha: str = Field(index=False)

    favoritos: list["Favorito"] = Relationship(back_populates="cliente")
    carrinhos: list["Carrinho"] = Relationship(back_populates="cliente")
    comentarios: list["Comentario"] = Relationship(back_populates="cliente")


class Favorito(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    produto_id: int = Field(foreign_key="produto.id")
    cliente_id: int = Field(foreign_key="cliente.id")

    produto: "Produto" = Relationship(back_populates="favoritos")
    cliente: "Cliente" = Relationship(back_populates="favoritos")


class Carrinho(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    cliente_id: int = Field(foreign_key="cliente.id")
    produto_id: int = Field(foreign_key="produto.id")
    qnt_produto: int = Field(default=1, index=False)

    cliente: "Cliente" = Relationship(back_populates="carrinhos")
    produto: "Produto" = Relationship(back_populates="carrinhos")


class Amigo(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    amigo_de: int = Field(foreign_key="cliente.id")
    amigo: int = Field(foreign_key="cliente.id")
    solicitacao: str = Field(index=False)


class Comentario(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    conteudo: Optional[str] = Field(sa_column=Column(String(500)), index=False)
    avaliacao: int = Field(index=False)

    cliente_id: int = Field(foreign_key="cliente.id")
    produto_id: int = Field(foreign_key="produto.id")

    cliente: "Cliente" = Relationship(back_populates="comentarios")
    produto: "Produto" = Relationship(back_populates="comentarios")






    







