import "./EditarProduto.css"
import "../Cores.css"
import { useState } from "react";

export default function AdicionarProduto({categorias, props}){

    const [fileName, setFileName] = useState(props.filename);

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
                <input type="text" name="name" placeholder="Nome do Produto" className="nome-prod" value={props.nome}/>
                <select name="categoria" className="categoria-prod">
                    <option value={props.categoria.id}>{props.categoria}</option>
                    {categorias.map((categoria)=>(
                        <option value={categoria.id}>{categoria.nome}</option>
                    ))}
                </select>
                <textarea name="descricao"placeholder="Descrição do Produto">{props.descricao}</textarea>
                <input type="text" name="preco" placeholder="Preço" className="preco-prod" value={props.preco}/>
                <input type="text" name="estoque" placeholder="Estoque" className="estoque-prod" value={props.estoque}/>
                <input type="text" name="desconto" placeholder="Desconto" className="desconto-prod" value={props.desconto}/>
                <button className="cadastro-button">Cadastrar</button>
            </div>
        </div>
    )
}