const produtos = [
  // Brinquedos
  {
    id: 1,
    nome: "Carrinho de Controle Remoto",
    preco: 129.90,
    avaliacao: 4.7,
    imagem_path: "https://picsum.photos/300/300?random=1",
    alt: "Carrinho de controle remoto vermelho",
    favorito: false,
    categoria: "Brinquedos",
    promocao: 15,
    estoque: 125 // Adicionado estoque inicial
  },
  // Cosméticos
  {
    id: 2,
    nome: "Batom Líquido Matte",
    preco: 39.90,
    avaliacao: 4.6,
    imagem_path: "https://picsum.photos/300/300?random=2",
    alt: "Batom líquido vermelho",
    favorito: false,
    categoria: "Cosméticos",
    promocao: 0,
    estoque: 88 // Adicionado estoque inicial
  },
  // Esporte
  {
    id: 3,
    nome: "Bola de Futebol Oficial",
    preco: 89.90,
    avaliacao: 4.8,
    imagem_path: "https://picsum.photos/300/300?random=3",
    alt: "Bola de futebol branca e preta",
    favorito: false,
    categoria: "Esporte",
    promocao: 20,
    estoque: 35 // Adicionado estoque inicial
  },
  // Roupas
  {
    id: 4,
    nome: "Camiseta Polo Masculina",
    preco: 99.90,
    avaliacao: 4.5,
    imagem_path: "https://picsum.photos/300/300?random=4",
    alt: "Camiseta polo azul",
    favorito: false,
    categoria: "Roupas",
    promocao: 0,
    estoque: 150 // Adicionado estoque inicial
  },
  // Eletrônicos
  {
    id: 5,
    nome: "Fone de Ouvido Bluetooth",
    preco: 159.90,
    avaliacao: 4.4,
    imagem_path: "https://picsum.photos/300/300?random=5",
    alt: "Fone de ouvido preto",
    favorito: false,
    categoria: "Eletrônicos",
    promocao: 10,
    estoque: 62 // Adicionado estoque inicial
  },
  // Papelaria
  {
    id: 6,
    nome: "Caderno Universitário 100 folhas",
    preco: 14.90,
    avaliacao: 4.2,
    imagem_path: "https://picsum.photos/300/300?random=6",
    alt: "Caderno universitário colorido",
    favorito: false,
    categoria: "Papelaria",
    promocao: 0,
    estoque: 200 // Adicionado estoque inicial
  },
  // Bolsas
  {
    id: 7,
    nome: "Bolsa de Couro Feminina",
    preco: 319.90,
    avaliacao: 4.9,
    imagem_path: "https://picsum.photos/300/300?random=7",
    alt: "Bolsa de couro marrom",
    favorito: false,
    categoria: "Bolsas",
    promocao: 25,
    estoque: 45 // Adicionado estoque inicial
  },
  // Calçados
  {
    id: 8,
    nome: "Tênis Casual Unissex",
    preco: 199.90,
    avaliacao: 4.8,
    imagem_path: "https://picsum.photos/300/300?random=8",
    alt: "Tênis casual branco",
    favorito: false,
    categoria: "Calçados",
    promocao: 0,
    estoque: 99 // Adicionado estoque inicial
  },
  // Cozinha
  {
    id: 9,
    nome: "Conjunto de Panelas Antiaderente",
    preco: 249.90,
    avaliacao: 4.7,
    imagem_path: "https://picsum.photos/300/300?random=9",
    alt: "Conjunto de panelas coloridas",
    favorito: false,
    categoria: "Cozinha",
    promocao: 30,
    estoque: 28 // Adicionado estoque inicial
  },
  // Móveis
  {
    id: 10,
    nome: "Cadeira Gamer Ergonômica",
    preco: 599.90,
    avaliacao: 4.6,
    imagem_path: "https://picsum.photos/300/300?random=10",
    alt: "Cadeira gamer preta",
    favorito: false,
    categoria: "Móveis",
    promocao: 0,
    estoque: 15 // Adicionado estoque inicial
  }
];

let id = 11;

const categorias = [
  "Brinquedos", "Cosméticos", "Esporte", "Roupas", "Eletrônicos", "Papelaria", "Bolsas", "Calçados", "Cozinha", 
  "Móveis", "Ferramentas", "Limpeza", "Livros"
];

// Função auxiliar para gerar um número aleatório de estoque (entre 10 e 200)
function gerarEstoqueAleatorio() {
    return Math.floor(Math.random() * (200 - 10 + 1)) + 10;
}

categorias.forEach(categoria => {
  for (let i = 1; i <= 10; i++) {
    const estaEmPromocao = Math.random() < 0.3;
    const desconto = estaEmPromocao ? Math.floor(Math.random() * 46) + 5 : 0;
    
    produtos.push({
      id: id++,
      nome: `${categoria} Produto ${i}`,
      preco: Number((Math.random() * 300 + 20).toFixed(2)),
      avaliacao: (Math.random() * 2 + 3).toFixed(1), // de 3.0 a 5.0
      imagem_path: `https://picsum.photos/300/300?random=${id}`,
      alt: `${categoria} Produto ${i}`,
      favorito: false,
      categoria,
      promocao: desconto,
      estoque: gerarEstoqueAleatorio() // 👈 Estoque gerado aleatoriamente para os novos produtos
    });
  }
});

export default produtos;