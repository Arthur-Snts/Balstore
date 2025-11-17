import "./PedidosEnviados.css"
import ProdutoHorizontal from "./ProdutoHorizontal"


export default function PedidosEnviados({produtos}){


    const renameKeys = (obj, keyMap) => {
        return Object.fromEntries(
            Object.entries(obj).map(([key, value]) => [
            keyMap[key] || key,
            value
            ])
        );
    };

    const keyMap = {
        estoque: "qnt",
    };

    const novosProdutos = produtos.map(produto => renameKeys(produto, keyMap));
    

    return(
        <div className="produtos">
            <div className='search-product'>
                <i className="fa fa-search"></i>
                <input type="text"  placeholder="Pesquisar Pedido da sua Loja"/>
            </div>

           
            <div className="produtos-div">
                {novosProdutos.map((produto, index) => (
                    <ProdutoHorizontal props={produto} key={index}>
                    </ProdutoHorizontal>
                ))}
            </div>
        </div>
    )
}