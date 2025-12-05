import "./PedidosPendentes.css"
import ProdutoHorizontal from "./ProdutoHorizontal"
import { useState, useEffect } from "react"
import Modal from "../Auxiliares/Modal"
import { useNavigate } from "react-router-dom"
import { useAlert } from "../Auxiliares/AlertContext"
import { getcliente, getCompra, getendereco_id, putCompra, deleteCompra} from "../../statements";

export default function PedidosPendentes({compras}){

    const [listaProdutos, setListaProdutos] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const {showAlert} = useAlert()
    const [produtoSelecionado, setProdutoSelecionado] = useState(null);
    const [cod_rastreio, setCod_Rastreio] = useState("")
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [produtoNegado, setProdutoNegado] = useState(null);
    const navigate = useNavigate()

    const abrirModalNegar = (produto) => {
        setProdutoNegado(produto);
        setIsDeleteOpen(true);
    };

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

                // ⭐️ FILTRA APENAS COMPRAS APROVADAS
                

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

    const abrirModalAprovar = (produto) => {
        setProdutoSelecionado(produto);
        setIsOpen(true);
    };

    async function AprovarProduto () {

        if (!produtoSelecionado) {
            showAlert("Nenhum produto selecionado", "info");
            return;
        }

        if (!cod_rastreio || cod_rastreio.trim().length < 5) {
            showAlert("Digite um código de rastreio válido", "info");
            return;
        }
        const resultado_aprovar = putCompra(produtoSelecionado.com_id, {cod_rastreio:cod_rastreio, situacao: "Produto Enviado"})
        showAlert("Pedido atualizado com sucesso!", "success");
        setListaProdutos(prev =>
            prev.filter(p => p.com_id !== produtoSelecionado.com_id)
        );


        // fechar modal e limpar campos
        setCod_Rastreio("");
        setProdutoSelecionado(null);
        setIsOpen(false);
        navigate("/Loja/Pedidos")
    };

    async function negarProduto() {

        if (!produtoNegado) {
            showAlert("Nenhum produto selecionado", "info");
            return;
        }

        await deleteCompra(produtoNegado.com_id);

        showAlert("Pedido negado com sucesso!", "success");

        setListaProdutos(prev =>
            prev.filter(p => p.com_id !== produtoNegado.com_id)
        );

        setProdutoNegado(null);
        setIsDeleteOpen(false);
    }

    const [busca, setBusca] = useState("");
    const pedidosFiltrados = listaProdutos.filter(produto => {
        const texto = busca.toLowerCase();

        return (
            produto.nome?.toLowerCase().includes(texto)
        );
    });
    

    return(
        <div className="produtos">
            <div className='search-product'>
                <i className="fa fa-search"></i>
                <input type="text"  placeholder="Pesquisar Pedido da sua Loja" value={busca} onChange={(e) => setBusca(e.target.value)}/>
            </div>

            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} >
                <h3>{produtoSelecionado?.nome}</h3>
                <p className="subtitulo">Uma compra desse produto foi realizada com as informações abaixo, coloque o número do pacote dos correios</p>
                <div className="hr"></div>
                <div className="dados">
                    <div className="cliente">
                        <h6>Cliente:</h6>
                        <p>{produtoSelecionado?.cliente?.nome}</p>
                    </div>
                    <div className="endereco">
                        <h6>Endereco:</h6>
                        <p>{produtoSelecionado?.endereco?.rua}, {produtoSelecionado?.endereco?.numero} - {produtoSelecionado?.endereco?.cidade} / {produtoSelecionado?.endereco?.estado}</p>
                    </div>
                </div>
                <div className="hr"></div>
                <input type="text" placeholder="Código de Rastreio" className="codigo-rastreio" value={cod_rastreio} onChange={(e)=> (setCod_Rastreio(e.target.value))}/>
                <div className="buttons-modal">
                    <button onClick={() => setIsOpen(false)} className="cancel-button">Cancelar</button>
                    <button onClick={AprovarProduto} className="confirm-button">Confirmar</button>     
                </div>  
            </Modal>
            <Modal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)}>
                <h3>Negar Pedido</h3>
                <p className="subtitulo">
                    Tem certeza que deseja negar o pedido do produto 
                    <strong> {produtoNegado?.nome}</strong>?
                </p>

                <div className="hr"></div>

                <div className="buttons-modal">
                    <button onClick={() => setIsDeleteOpen(false)} className="cancel-button">
                        Cancelar
                    </button>

                    <button onClick={negarProduto} className="confirm-button">
                        Negar Pedido
                    </button>
                </div>
            </Modal>
            <div className="produtos-div">
                {pedidosFiltrados.map((produto, index) => (
                    <ProdutoHorizontal props={produto} key={index}>
                        <div className="buttons-children">
                            <a onClick={() => abrirModalAprovar(produto)} className="edit-button">Enviar Pacote <i className="fa fa-check"></i></a>
                            <a className="delete-button" onClick={() => abrirModalNegar(produto)}>Negar <i className="fa fa-trash"></i></a>
                        </div>
                    </ProdutoHorizontal>
                ))}
            </div>
        </div>
    )
}