from sqlmodel import SQLModel, Field
from typing import List
from datetime import date


class Categoria(SQLModel, table=True):
    id: int = Field(primary_key=True)
    nome: str = Field(index=True)

class Produto(SQLModel, table=True):
    id: int = Field(primary_key=True)
    nome: str = Field(index=True)
    categoria: Categoria = Field(index=True)
    estoque: int = Field(index=False)

class Favorito(SQLModel, table= True):
    id: 

class Cliente(SQLModel, table=True):
    id: int = Field(primary_key=True)
    nome: str = Field(index=False)
    cpf: str = Field(index=False)
    email: str = Field(index=False)
    senha: str = Field(index=False)

    favoritos: List[Favorito] = Field()
    amigos: List[Cliente] = Field()
    carrinho: List[Produto] = Field()







