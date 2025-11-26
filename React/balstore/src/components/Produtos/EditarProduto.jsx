import "./EditarProduto.css";
import "../Cores.css";
import { useState, useEffect } from "react";

export default function EditarProduto({ categorias, produto, onSave }) {

    // Somente texto e números
    const [produtoEditado, setProdutoEditado] = useState({
        nome: "",
        categoria: "",
        preco: "",
        estoque: "",
        promocao: "",
    });

    // Imagem fica separada
    const [imagemNova, setImagemNova] = useState(null);
    const [fileName, setFileName] = useState("");

    // Carrega dados iniciais
    useEffect(() => {
        if (produto) {
            setProdutoEditado({
                nome: produto.nome,
                categoria: produto.categoria.id,
                preco: produto.preco,
                estoque: produto.estoque,
                promocao: produto.promocao,
            });
        }
    }, [produto]);

    // Atualiza campos normais
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProdutoEditado((prev) => ({ ...prev, [name]: value }));
    };

    // Atualiza imagem separada
    const handleFileChange = (e) => {
        if (e.target.files.length > 0) {
            const file = e.target.files[0];
            setImagemNova(file);
            setFileName(file.name);
        }
    };

    const handleSave = () => {
        onSave(
            produto.id,
            produtoEditado,
            imagemNova
        );
    };

    return (
        <div className="adicionando">
            
            <div className="inserir_imagem">
                <label className="custom-file-upload">
                    <input 
                        type="file"
                        name="imagem"
                        onChange={handleFileChange}
                    />
                    Escolher imagem
                </label>

                Arquivo Selecionado:
                {fileName && <span className="file-name"> {fileName}</span>}

                <p>Imagem Antiga:</p>
                <img src={`http://localhost:8000${produto.imagem_path}`} alt="" />
            </div>

            <div className="form">
                <input 
                    type="text" 
                    name="nome" 
                    placeholder="Nome do Produto"
                    className="nome-prod"
                    value={produtoEditado.nome}
                    onChange={handleChange}
                />

                <select
                    name="categoria"
                    className="categoria-prod"
                    value={produtoEditado.categoria}
                    onChange={handleChange}
                >
                    {categorias.map((categoria) => (
                        <option key={categoria.id} value={categoria.id}>
                            {categoria.nome}
                        </option>
                    ))}
                </select>

                <input 
                    type="text"
                    name="preco"
                    placeholder="Preço"
                    className="preco-prod"
                    value={produtoEditado.preco}
                    onChange={handleChange}
                />

                <input 
                    type="text"
                    name="estoque"
                    placeholder="Estoque"
                    className="estoque-prod"
                    value={produtoEditado.estoque}
                    onChange={handleChange}
                />

                <input 
                    type="text"
                    name="promocao"
                    placeholder="Desconto"
                    className="desconto-prod"
                    value={produtoEditado.promocao}
                    onChange={handleChange}
                />

                <button 
                    className="cadastro-button"
                    onClick={handleSave}
                >
                    Editar
                </button>
            </div>
        </div>
    );
}
