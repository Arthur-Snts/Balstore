import os
from sqlmodel import Session, select
from datetime import datetime
from PIL import Image  # Para gerar imagens reais
from werkzeug.security import generate_password_hash
from models import (
    Categoria, Loja, Cliente, Endereco, Produto,
    Comentario, Favorito, Carrinho, Amigo
)




def save_fake_image(filename: str) -> str:
    """
    Cria uma imagem real .jpg no diretório /uploads e retorna a URL.
    """
    UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "uploads")
    os.makedirs(UPLOAD_DIR, exist_ok=True)

    file_path = os.path.join(UPLOAD_DIR, filename)

    # Cria uma imagem RGB simples (300×300)
    img = Image.new("RGB", (300, 300), color=(240, 240, 240))
    img.save(file_path, "JPEG")

    return f"/uploads/{filename}"


def run_seeds(engine):

    with Session(engine) as session:

        # ==============================
        # 1. CATEGORIAS
        # ==============================
        categorias_nomes = [
            "Brinquedos","Cosméticos","Esportes","Roupas","Eletrônicos",
            "Papelaria","Bolsas","Calçados","Cozinha","Móveis",
            "Ferramentas","Limpeza","Livros"
        ]

        categorias = []
        for nome in categorias_nomes:
            cat = session.exec(select(Categoria).where(Categoria.nome == nome)).first()
            if not cat:
                cat = Categoria(nome=nome)
                session.add(cat)
            categorias.append(cat)

        session.commit()
        