import { useState, useEffect } from "react";
import './Filtros.css'

const categorias = [
  "Brinquedos","Cosméticos","Esportes","Roupas","Eletrônicos",
  "Papelaria","Bolsas","Calçados","Cozinha","Móveis",
  "Ferramentas","Limpeza","Livros",
];

function FiltrosDeProduto({ onChangeFiltros, filtrosAtuais }) {
  const [categoriasSelecionadas, setCategoriasSelecionadas] = useState(filtrosAtuais?.categorias || []);
  const [precoMin, setPrecoMin] = useState(filtrosAtuais?.precoMin || "");
  const [precoMax, setPrecoMax] = useState(filtrosAtuais?.precoMax || "");

  // Sincroniza mudanças vindas do pai
  useEffect(() => {
    setCategoriasSelecionadas(filtrosAtuais?.categorias || []);
    setPrecoMin(filtrosAtuais?.precoMin || "");
    setPrecoMax(filtrosAtuais?.precoMax || "");
  }, [filtrosAtuais]);

  const handleCategoriaChange = (e) => {
    const categoria = e.target.value;
    const novasCategorias = e.target.checked
      ? [...categoriasSelecionadas, categoria]
      : categoriasSelecionadas.filter((c) => c !== categoria);

    setCategoriasSelecionadas(novasCategorias);

    onChangeFiltros({
      categorias: novasCategorias,
      precoMin,
      precoMax
    });
  };

  const confirmarPreco = () => {
    onChangeFiltros({
      categorias: categoriasSelecionadas,
      precoMin,
      precoMax
    });
  };

  return (
    <div className="filtros-container">
      <div className="filtros-cabecalho">
        <span className="icone-filtro">☰</span>
        <h2 className="titulo-filtros">FILTROS</h2>
      </div>

      <form>
        <div className="secao-filtro">
          <h3 className="subtitulo-filtro">Por Categoria</h3>
          <div className="lista-categorias">
            {categorias.map((categoria) => (
              <label key={categoria} className="checkbox-categoria">
                <input
                  type="checkbox"
                  name="categoria"
                  value={categoria}
                  checked={categoriasSelecionadas.includes(categoria)}
                  onChange={handleCategoriaChange}
                />
                {categoria}
              </label>
            ))}
          </div>
        </div>

        <hr className="separador" />

        <div className="secao-filtro">
          <h3 className="subtitulo-filtro">Por Preço</h3>
          <div className="filtro-preco">
            <input
              type="number"
              placeholder="mín."
              className="input-preco"
              value={precoMin}
              onChange={(e) => setPrecoMin(e.target.value)}
            />
            <span className="separador-preco"></span>
            <input
              type="number"
              placeholder="máx."
              className="input-preco"
              value={precoMax}
              onChange={(e) => setPrecoMax(e.target.value)}
            />
          </div>

          <button
            className="botao-confirmar"
            type="button"
            onClick={confirmarPreco}
          >
            Confirmar
          </button>
        </div>
      </form>
    </div>
  );
}

export default FiltrosDeProduto;