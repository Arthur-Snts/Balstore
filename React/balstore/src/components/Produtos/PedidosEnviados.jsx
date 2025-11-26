import "./PedidosEnviados.css"
import ProdutoHorizontal from "./ProdutoHorizontal"
import { useState, useEffect} from "react";
import { useAlert } from "../Auxiliares/AlertContext";
import { getCompra, getcliente, getendereco_id } from "../../statements";


export default function PedidosEnviados({compras}){

    const [listaProdutos, setListaProdutos] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const {showAlert} = useAlert()
    const [produtoSelecionado, setProdutoSelecionado] = useState(null);
    const [cod_rastreio, setCod_Rastreio] = useState("")


     useEffect(() => {
            if (!compras) return;
            async function carregarprodutos() {
                const list_produtos_comprados = [];
    
                const resultados = await Promise.all(
                    compras.map(async (compra) => {
                        const resultado_compra = await getCompra(compra.id);
                        return { compra, resultado_compra };
                    })
                );
    
                for (const { compra, resultado_compra } of resultados) {
                    if (resultado_compra.success) {
    
                        for (const compraItem of (resultado_compra.p || [])) {
    
                            for (const produto of (compraItem.produtos || [])) {
    
                                const resultado_cliente = await getcliente(compra.cliente_id);
                                const cliente = resultado_cliente.cliente;
    
                                const resultado_endereco = await getendereco_id(compra.end_id);
                                const endereco = resultado_endereco.endereco;
    
                                list_produtos_comprados.push({
                                    ...produto,
                                    cliente: cliente,
                                    endereco: endereco,
                                    com_id: compra.id 
                                });
                            }
                        }
                    }
                }
                
    
                setListaProdutos(list_produtos_comprados);
                
                }
    
            carregarprodutos();
        }, [compras]);
    

    return(
        <div className="produtos">
            <div className='search-product'>
                <i className="fa fa-search"></i>
                <input type="text"  placeholder="Pesquisar Pedido da sua Loja"/>
            </div>

           
            <div className="produtos-div">
                {listaProdutos.map((produto, index) => (
                    <ProdutoHorizontal props={produto} key={index}>
                    </ProdutoHorizontal>
                ))}
            </div>
        </div>
    )
}