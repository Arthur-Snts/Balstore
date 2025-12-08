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
                <div className="input-container">
                    <input 
                    id="Nome"
                    type="text" 
                    name="nome" 
                    placeholder="" 
                    className="input-field"
                    value={produtoEditado.nome}
                    onChange={handleChange}
                    />
                    <label for="Nome" className="input-label">Nome do Produto</label>
                </div>

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

                <div className="input-container">
                    <input 
                    id="Preco"
                    type="text" 
                    name="Preco" 
                    placeholder="" 
                    className="input-field"
                    value={produtoEditado.preco}
                    onChange={handleChange}
                    />
                    <label for="Preco" className="input-label">Preço do Produto</label>
                </div>

                <div className="input-container">
                    <input 
                    id="Estoque"
                    type="text" 
                    name="Estoque" 
                    placeholder="" 
                    className="input-field"
                    value={produtoEditado.estoque}
                    onChange={handleChange}
                    />
                    <label for="Estoque" className="input-label">Estoque</label>
                </div>
                <div className="input-container">
                    <input 
                    id="Promocao"
                    type="text" 
                    name="promocao" 
                    placeholder="" 
                    className="input-field"
                    value={produtoEditado.promocao}
                    onChange={handleChange}
                    />
                    <label for="Promocao" className="input-label">Desconto (Colocar número inteiro)</label>
                </div>

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
