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
    categoria: "Brinquedos"
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
    categoria: "Cosméticos"
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
    categoria: "Esporte"
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
    categoria: "Roupas"
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
    categoria: "Eletrônicos"
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
    categoria: "Papelaria"
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
    categoria: "Bolsas"
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
    categoria: "Calçados"
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
    categoria: "Cozinha"
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
    categoria: "Móveis"
  }
];

let id = 11;

const categorias = [
  "Brinquedos", "Cosméticos", "Esporte", "Roupas", "Eletrônicos", "Papelaria", "Bolsas", "Calçados", "Cozinha", 
  "Móveis", "Ferramentas", "Limpeza", "Livros"
];

categorias.forEach(categoria => {
  for (let i = 1; i <= 10; i++) {
    produtos.push({
      id: id++,
      nome: `${categoria} Produto ${i}`,
      preco: Number((Math.random() * 300 + 20).toFixed(2)),
      avaliacao: (Math.random() * 2 + 3).toFixed(1), // de 3.0 a 5.0
      imagem_path: `https://picsum.photos/300/300?random=${id}`,
      alt: `${categoria} Produto ${i}`,
      favorito: false,
      categoria
    });
  }
});

export default produtos;
