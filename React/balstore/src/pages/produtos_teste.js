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
    promocao: 15
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
    promocao: 0
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
    promocao: 20
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
    promocao: 0
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
    promocao: 10
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
    promocao: 0
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
    promocao: 25
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
    promocao: 0
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
    promocao: 30
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
    promocao: 0
  }
];

let id = 11;

const categorias = [
  "Brinquedos", "Cosméticos", "Esporte", "Roupas", "Eletrônicos", "Papelaria", "Bolsas", "Calçados", "Cozinha", 
  "Móveis", "Ferramentas", "Limpeza", "Livros"
];

categorias.forEach(categoria => {
  for (let i = 1; i <= 10; i++) {
    // Gera aleatoriamente se está em promoção (30% de chance)
    const estaEmPromocao = Math.random() < 0.3;
    // Se estiver em promoção, gera um desconto entre 5% e 50%
    const desconto = estaEmPromocao ? Math.floor(Math.random() * 46) + 5 : 0;
    
    produtos.push({
      id: id++,
      nome: `${categoria} Produto ${i}`,
      preco: parseFloat((Math.random() * 300 + 20).toFixed(2)), // ✅ Agora é número
      avaliacao: parseFloat((Math.random() * 2 + 3).toFixed(1)), // ✅ Agora é número
      imagem_path: `https://picsum.photos/300/300?random=${id}`,
      alt: `${categoria} Produto ${i}`,
      favorito: false,
      categoria,
      promocao: desconto
    });
  }
});

export default produtos;