import os
from sqlmodel import Session, select
from datetime import datetime
from PIL import Image  # Para gerar imagens reais
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
        cat_id = {c.nome: c.id for c in categorias}

        # ==============================
        # 2. LOJAS
        # ==============================
        lojas_info = [
            ("Loja Alpha", "alpha@loja.com", "12345678900011", "senha123", "Brinquedos e infantis."),
            ("MegaTech", "contato@megatech.com", "55443322110088", "senha123", "Eletrônicos variados."),
            ("SportLife", "vendas@sportlife.com", "99001122334455", "senha123", "Artigos esportivos.")
        ]

        lojas = []
        for nome, email, cnpj, senha, desc in lojas_info:
            loja = session.exec(select(Loja).where(Loja.cnpj == cnpj)).first()
            if not loja:
                loja = Loja(nome=nome, email=email, cnpj=cnpj, senha=senha, descricao=desc)
                session.add(loja)
            lojas.append(loja)

        session.commit()

        # ==============================
        # 3. CLIENTES
        # ==============================
        clientes_info = [
            ("Ana Silva", "11111111111", "ana@email.com", "1234"),
            ("Carlos Souza", "22222222222", "carlos@email.com", "1234"),
            ("Mariana Lima", "33333333333", "mariana@email.com", "1234"),
            ("Pedro Alves", "44444444444", "pedro@email.com", "1234"),
            ("Julia Costa", "55555555555", "julia@email.com", "1234"),
        ]

        clientes = []
        for nome, cpf, email, senha in clientes_info:
            cli = session.exec(select(Cliente).where(Cliente.cpf == cpf)).first()
            if not cli:
                cli = Cliente(nome=nome, cpf=cpf, email=email, senha=senha)
                session.add(cli)
            clientes.append(cli)

        session.commit()

        # ==============================
        # 4. ENDEREÇOS
        # ==============================
        for i, cli in enumerate(clientes, start=1):
            existe = session.exec(select(Endereco).where(Endereco.cli_id == cli.id)).first()
            if not existe:
                session.add(Endereco(
                    cli_id=cli.id,
                    rua=f"Rua {i}",
                    numero=str(100 + i),
                    bairro="Centro",
                    cidade="São Paulo",
                    estado="SP",
                    CEP="01001000"
                ))

        session.commit()

        # ==============================
        # 5. AMIGOS
        # ==============================
        session.add(Amigo(amigo_de=clientes[0].id, amigo=clientes[1].id, solicitacao="Solicitação Enviada"))
        session.add(Amigo(amigo_de=clientes[1].id, amigo=clientes[4].id, solicitacao="Solicitação Aceita"))
        session.commit()

        # ==============================
        # 6. PRODUTOS COM UPLOAD REAL
        # ==============================
        produtos_info = [
            ("Carrinho Hot Wheels", 49.90, 30, "Brinquedos", 10, lojas[0].id),
            ("Boneca Fashion", 79.90, 20, "Brinquedos", 15, lojas[0].id),
            ("Notebook Gamer", 5999.90, 10, "Eletrônicos", 5, lojas[1].id),
            ("Mouse RGB", 129.90, 50, "Eletrônicos", 20, lojas[1].id),
            ("Bola de Futebol", 89.90, 35, "Esportes", 0, lojas[2].id),
            ("Camisa Esportiva", 59.90, 40, "Esportes", 30, lojas[2].id),
        ]

        produtos_salvos = []

        for nome, preco, estoque, categoria, promocao, loja_id in produtos_info:
            existente = session.exec(select(Produto).where(
                Produto.nome == nome, Produto.loja_id == loja_id
            )).first()

            if not existente:

                # gera filename real
                timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
                filename = f"{timestamp}_{nome.replace(' ', '_')}.jpg"

                # cria imagem real
                file_url = save_fake_image(filename)

                novo = Produto(
                    nome=nome,
                    preco=preco,
                    estoque=estoque,
                    categoria_id=cat_id[categoria],
                    loja_id=loja_id,
                    promocao=promocao,
                    imagem_path=file_url
                )

                session.add(novo)
                produtos_salvos.append(novo)

        session.commit()

        # Atualiza lista completa
        produtos = session.exec(select(Produto)).all()

        # ==============================
        # 7. COMENTÁRIOS
        # ==============================
        session.add(Comentario(cliente_id=clientes[0].id, produto_id=produtos[0].id, avaliacao=5, conteudo="Excelente!"))
        session.add(Comentario(cliente_id=clientes[1].id, produto_id=produtos[1].id, avaliacao=4, conteudo="Muito bom."))
        session.add(Comentario(cliente_id=clientes[2].id, produto_id=produtos[2].id, avaliacao=3, conteudo="Ok."))

        session.commit()

        # ==============================
        # 8. FAVORITOS
        # ==============================
        session.add(Favorito(cliente_id=clientes[0].id, produto_id=produtos[2].id))
        session.add(Favorito(cliente_id=clientes[1].id, produto_id=produtos[0].id))

        session.commit()

        # ==============================
        # 9. CARRINHO
        # ==============================
        session.add(Carrinho(cliente_id=clientes[0].id, produto_id=produtos[1].id, qnt_produto=1))
        session.add(Carrinho(cliente_id=clientes[3].id, produto_id=produtos[3].id, qnt_produto=2))

        session.commit()

        print("🌱 Seeds inseridos com uploads reais!")
