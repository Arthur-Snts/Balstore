// FiltrosDeProduto.jsx
import './Filtros.css'; // Não esqueça de importar o CSS

const categorias = [
  "Brinquedos",
  "Cosméticos",
  "Esporte",
  "Roupas",
  "Eletrônicos",
  "Papelaria",
  "Bolsas",
  "Calçados",
  "Cozinha",
  "Móveis",
  "Ferramentas",
  "Limpeza",
  "Livros",
];

function FiltrosDeProduto() {
  return (
    <div className="filtros-container">
      <div className="filtros-cabecalho">
        <span className="icone-filtro">☰</span> {/* Ícone simplificado */}
        <h2 className="titulo-filtros">FILTROS</h2>
      </div>

      <div className="secao-filtro">
        <h3 className="subtitulo-filtro">Por Categoria</h3>
        <div className="lista-categorias">
          {categorias.map((categoria) => (
            <label key={categoria} className="checkbox-categoria">
              <input type="checkbox" name="categoria" value={categoria} />
              {categoria}
            </label>
          ))}
        </div>
      </div>

      <hr className="separador" />

      <div className="secao-filtro">
        <h3 className="subtitulo-filtro">Por Preço</h3>
        <div className="filtro-preco">
          <input type="text" placeholder="mín." className="input-preco" />
          <span className="separador-preco"></span> {/* Traço entre os inputs */}
          <input type="text" placeholder="máx." className="input-preco" />
        </div>
        <button className="botao-confirmar">Confirmar</button>
      </div>
    </div>
  );
}

export default FiltrosDeProduto;