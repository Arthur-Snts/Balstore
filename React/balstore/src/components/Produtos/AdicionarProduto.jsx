import "./AdicionarProduto.css"
import "../Cores.css"
import { useState } from "react";

export default function AdicionarProduto({categorias}){

    const [fileName, setFileName] = useState("");

    const handleFileChange = (e) => {
        if (e.target.files.length > 0) {
        setFileName(e.target.files[0].name);
        }
    };

    return(
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
                <input type="text" name="name" placeholder="Nome do Produto" className="nome-prod"/>
                <select name="categoria" className="categoria-prod">
                    <option value="">Categorias</option>
                    {categorias.map((categoria)=>(
                        <option value={categoria.id}>{categoria.nome}</option>
                    ))}
                </select>
                <textarea name="descricao"placeholder="Descrição do Produto"></textarea>
                <input type="text" name="preco" placeholder="Preço" className="preco-prod"/>
                <input type="text" name="estoque" placeholder="Estoque" className="estoque-prod"/>
                <input type="text" name="desconto" placeholder="Desconto" className="desconto-prod"/>
                <button className="cadastro-button">Cadastrar</button>
            </div>
        </div>
    )
}