import "./AdicionarProduto.css"
import "../Cores.css"
import { useState } from "react";
import { postproduto } from "../../statements";
import { useAlert } from "../Auxiliares/AlertContext";
import { useNavigate } from "react-router-dom";

export default function AdicionarProduto({ categorias, loja_id }) {

    const [fileName, setFileName] = useState("");
    const [pro_imagem, setProImagem] = useState(null);
    const {showAlert} = useAlert()
    const navigate = useNavigate();

    const [nome, setNome] = useState("");
    const [categoria, setCategoria] = useState("");
    const [preco, setPreco] = useState("");
    const [estoque, setEstoque] = useState("");
    const [desconto, setDesconto] = useState("");

    const handleFileChange = (e) => {
        if (e.target.files.length > 0) {
            const file = e.target.files[0];
            setFileName(file.name);
            setProImagem(file);
        }
    };

    async function handlepost() {

        const produto_novo = {
            nome,
            categoria,
            preco,
            estoque,
            promocao: desconto
        };

        try {
            const resultado_post = await postproduto(produto_novo, pro_imagem, loja_id);
            if (resultado_post.success){
                showAlert("Produto cadastrado com sucesso", "success");
                navigate("/Loja/Produtos")
            }
            
        } catch (error) {
            showAlert("Falha ao Cadastrar Produto", "erro");
            navigate("/Loja/Produtos")
        }
    }

    return (
        <div className="adicionando">
            <div className="inserir_imagem">
                <label className="custom-file-upload">
                    <input 
                        type="file"
                        name="imagem_produto"
                        onChange={handleFileChange}
                    />
                    Escolher imagem
                </label>
                Arquivo Selecionado:
                {fileName && <span className="file-name"> {fileName}</span>}
            </div>

            <div className="form">
                <input 
                    type="text"
                    name="name"
                    placeholder="Nome do Produto"
                    className="nome-prod"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                />

                <select 
                    name="categoria" 
                    className="categoria-prod"
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                >
                    <option value="">Categorias</option>
                    {categorias.map((categoria) => (
                        <option key={categoria.id} value={categoria.id}>
                            {categoria.nome}
                        </option>
                    ))}
                </select>
                
                <div className="input-container">
                    <input 
                        id="precos"
                        type="text"
                        name="preco"
                        placeholder=""
                        className="input-field"
                        value={preco}
                        onChange={(e) => setPreco(e.target.value)}
                    />
                    <label for="precos" className="input-label">Preço</label>
                </div>

                <input 
                    type="text"
                    name="preco"
                    placeholder="Preço"
                    className="preco-prod"
                    value={preco}
                    onChange={(e) => setPreco(e.target.value)}
                />

                <input 
                    type="text"
                    name="estoque"
                    placeholder="Estoque"
                    className="estoque-prod"
                    value={estoque}
                    onChange={(e) => setEstoque(e.target.value)}
                />

                <input 
                    type="text"
                    name="desconto"
                    placeholder="Desconto"
                    className="desconto-prod"
                    value={desconto}
                    onChange={(e) => setDesconto(e.target.value)}
                />

                <button 
                    className="cadastro-button"
                    onClick={handlepost}
                >
                    Cadastrar
                </button>
            </div>
        </div>
    );
}
