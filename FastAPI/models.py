from typing import Optional
from sqlmodel import SQLModel, Field, Relationship
from sqlalchemy import Column, String
from datetime import datetime


class Categoria(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    nome: str = Field(index=False)

    produtos: list["Produto"] = Relationship(back_populates="categoria")


class Compra_Produto(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    com_id: int = Field(foreign_key="compra.id")
    pro_id: int = Field(foreign_key="produto.id")


class Loja(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    nome: str = Field(index=False)
    email:str = Field(index=False)
    cnpj: str = Field(index=False, unique=True)
    senha: str = Field(index=False)  
    descricao: Optional[str] = Field(default=None, index=False)

    produtos: list["Produto"] = Relationship(back_populates="loja")


class Produto(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    nome: str = Field(index=False)
    estoque: int = Field(default=0, index=False)
    imagem_path: str = Field(index=False)
    preco:float = Field(index=False)
    promocao:int = Field(index=False)

    categoria_id: int = Field(foreign_key="categoria.id")
    categoria: "Categoria" = Relationship(back_populates="produtos")

    loja_id: int = Field(foreign_key="loja.id")
    loja: "Loja" = Relationship(back_populates="produtos")
    
    comentarios: list["Comentario"] = Relationship(back_populates="produto")
    favoritos: list["Favorito"] = Relationship(back_populates="produto")
    carrinhos: list["Carrinho"] = Relationship(back_populates="produto")
    compras: list["Compra"] = Relationship(
        back_populates="produtos",
        link_model=Compra_Produto
    )
    


class Cliente(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    nome: str = Field(index=False)
    cpf: str = Field(index=False, unique=True)
    email: str = Field(index=False, unique=True)
    senha: str = Field(index=False)

    amigos_enviados: list["Amigo"] = Relationship(
        back_populates="cliente_de",
        sa_relationship_kwargs={"foreign_keys": "[Amigo.amigo_de]"},
    )

    amigos_recebidos: list["Amigo"] = Relationship(
        back_populates="cliente_amigo",
        sa_relationship_kwargs={"foreign_keys": "[Amigo.amigo]"},
    )
    favoritos: list["Favorito"] = Relationship(back_populates="cliente")
    carrinhos: list["Carrinho"] = Relationship(back_populates="cliente",sa_relationship_kwargs={"foreign_keys": "[Carrinho.cliente_id]"})
    comentarios: list["Comentario"] = Relationship(back_populates="cliente")
    enderecos: list["Endereco"] = Relationship(back_populates="cliente")
    presentes: list["Carrinho"] = Relationship(back_populates="cliente_presenteado",sa_relationship_kwargs={"foreign_keys": "[Carrinho.presente_para]"})
    compras: list["Compra"] = Relationship(back_populates="cliente")

class Endereco (SQLModel, table=True):
    id:Optional[int] = Field(default=None, primary_key=True)
    rua: str = Field(index=False)
    numero: str = Field(index=False)
    bairro: str = Field(index=False)
    cidade: str = Field(index=False)
    estado: str = Field(index=False)
    CEP: str = Field(index=False)
    cliente: "Cliente" = Relationship(back_populates="enderecos")
    cli_id: Optional[int] = Field(foreign_key="cliente.id")

    compras: list["Compra"] = Relationship(back_populates="endereco")


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
    qnt_produto: Optional[int] = Field(default=1, index=False)

    presente_para: Optional[int] = Field(default=None, foreign_key="cliente.id")

    cliente: "Cliente" = Relationship(back_populates="carrinhos", sa_relationship_kwargs={"foreign_keys": "[Carrinho.cliente_id]"})
    cliente_presenteado: "Cliente" = Relationship(back_populates="presentes",sa_relationship_kwargs={"foreign_keys": "[Carrinho.presente_para]"})
    produto: "Produto" = Relationship(back_populates="carrinhos")


class Amigo(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    amigo_de: int = Field(foreign_key="cliente.id")
    amigo: int = Field(foreign_key="cliente.id")

    cliente_de: "Cliente" = Relationship(
        back_populates="amigos_enviados",
        sa_relationship_kwargs={"foreign_keys": "[Amigo.amigo_de]"},
    )

    cliente_amigo: "Cliente" = Relationship(
        back_populates="amigos_recebidos",
        sa_relationship_kwargs={"foreign_keys": "[Amigo.amigo]"},
    )
    solicitacao: str = Field(index=False)


class Comentario(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    conteudo: Optional[str] = Field(sa_column=Column(String(500)))
    avaliacao: int = Field(index=False)

    cliente_id: int = Field(foreign_key="cliente.id")
    produto_id: int = Field(foreign_key="produto.id")

    cliente: "Cliente" = Relationship(back_populates="comentarios")
    produto: "Produto" = Relationship(back_populates="comentarios")



class Compra(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    valor:float = Field(index=False)
    cliente_id: int = Field(foreign_key="cliente.id")
    data: Optional[datetime] = Field(default_factory=datetime.utcnow,index=False)
    situacao: Optional[str] = Field(default="Aguardando Pagamento", index=False)
    cod_rastreio: Optional[str] = Field(index=False)
    cod_pagamento: str = Field(index=False)
    frete: float = Field(index=False)
    end_id: int = Field(foreign_key="endereco.id")

    cliente: "Cliente" = Relationship(back_populates="compras")
    endereco: "Endereco" = Relationship(back_populates="compras")
    produtos: list["Produto"] = Relationship(
        back_populates="compras",
        link_model=Compra_Produto
    )
