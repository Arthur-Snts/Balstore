import Header from "../components/Header_and_Footer/Header"
import Footer from "../components/Header_and_Footer/Footer"
import ProdutoHorizontal from "../components/Produtos/ProdutoHorizontal"
import { useRef, useEffect, useState } from "react"
import produtos from "./produtos_teste"
import Loading from "./Loading"
import { useNavigate } from "react-router-dom"
import { useAlert } from "../components/Auxiliares/AlertContext"
import {deletecarrinho, getcarrinho, getprodutos, putcarrinho, verificar_token_cliente, postcarrinho, postCompra} from "../statements"
import Presente from "../assets/Presente.png"
import { MdDelete } from "react-icons/md";
import "./Carrinho.css"

export default function Carrinho () {

    const navigate = useNavigate();
    const [cliente, setCliente] = useState(null)
    const [loja, setLoja] = useState(null)
    const [loading, setLoading] = useState(true)
    const {showAlert} = useAlert()

    const [produtos_carrinho, setProdutos_Carrinho] = useState([])
    const [ProdutosRecomendados, setProdutosRecomendados] = useState([])
    const [valor_total, setValor_Total] = useState(0)

    const [status, setStatus] = useState("")
    

    useEffect(() => {
        async function carregarUsuario() {
            let token = localStorage.getItem("token");
            if (token){
                const user_devolvido = await verificar_token_cliente(navigate);
                
                setCliente(user_devolvido);
                setStatus("client")
            }
                else{
                    showAlert(`Você precisa estar conectado como Cliente para acessar essa página` , "info");
                    navigate("/Login") 
                }

        }
        carregarUsuario();
        setLoading(false)
    }, []);

    useEffect(() => {

        async function carregar() {
            if (cliente) {
                const resultado_carrinho = await getcarrinho(cliente.id)
                 
                if (resultado_carrinho?.success) {
                      
                    setProdutos_Carrinho(resultado_carrinho.carrinho)            
                }
                else {
                    showAlert(`Carrinho Vazio` , "info");
                }
            }

            const resultado_produtos = await getprodutos()
            if (resultado_produtos?.success) {
                const embaralhado = [...resultado_produtos.produtos].sort(() => Math.random() - 0.5);
                setProdutosRecomendados(embaralhado.slice(0,3))
            }
        }
        carregar();
        
    }, [cliente]);

    useEffect(() => {

        document.title = "Carrinho";
    }, []);

    

    useEffect(() => {
            const total = produtos_carrinho.reduce((acc, carrinho) => {
                return acc + (carrinho.produto.preco * carrinho.qnt_produto);
            }, 0);

            setValor_Total(total.toFixed(2));

            

        }, [produtos_carrinho]);

    async function alterarQuantidade(car_id, qnt_nova) {
            
            const resultado_carrinho = await putcarrinho(car_id, qnt_nova)
                
            if (resultado_carrinho?.success) {
                    
                setProdutos_Carrinho(prev =>
                    prev.map(item =>
                        item.id === car_id
                            ? { ...item, qnt_produto: qnt_nova }
                            : item
                    )
                );
            }
            else {
                
            }
            
        }

    async function handleExcluir(car_id) {
        
        const resultado_carrinho = await deletecarrinho(car_id)
            
        if (resultado_carrinho?.success) {
                
            showAlert(`Produto Retirado do Carrinho com Sucesso` , "success");
            setProdutos_Carrinho(prev =>
                prev.filter(item => item.id !== car_id)
            );
        }
        else {
            showAlert(`Falha ao Retirar do Carrinho` , "erro");
        }
        
    }

    async function handlecarrinho(id) {
            const qnt = 1;
    
            const carrinhoExistente = cliente.carrinhos.find(f => f.produto_id === id);
            if (carrinhoExistente){
                showAlert(`Produto já disponível no seu carrinho`, "info");
                return;
            }
    
            const resultado = await postcarrinho(id, cliente.id, null, qnt);
    
            if (resultado?.success){
                showAlert(`Produto adicionado ao seu carrinho`, "info");
                setCliente(prev => ({
                    ...prev,
                    carrinhos: [...prev.carrinhos, resultado.carrinho]
                }));
            } else {
                showAlert(`${resultado?.status}`, "info");
            }
        }

    const [endereco, setEndereco] = useState(null)
    const selectRef = useRef(null);
    const [needFocusSelect, setNeedFocusSelect] = useState(false);

    useEffect(() => {
        if (needFocusSelect) {
            // pequeno delay para garantir que qualquer alerta tenha terminado de manipular o foco
            const t = setTimeout(() => {
            selectRef.current?.focus();
            setNeedFocusSelect(false);
            }, 50);
            return () => clearTimeout(t);
        }
        }, [needFocusSelect]);

    async function handlecomprar() {
        if (produtos_carrinho.length === 0){
            showAlert(`Coloque itens no Carrinho Primeiro`, "info");
            return;
        }
        if (!endereco){
            showAlert(`Selecione um Endereço Primeiro`, "info");
            setNeedFocusSelect(true);
            return;
        }
            var list_produtos = []
            produtos_carrinho.map((carrinho) => {
                
                if (carrinho.qnt_produto > carrinho.produto.estoque){
                    showAlert(`Um dos seus Produtos no seu Carrinho não está disponível na quantidade desejada`, "info");
                }

                list_produtos.push(carrinho.produto.id)
                
                deletecarrinho(carrinho.id)
                setProdutos_Carrinho(prev =>
                    prev.filter(item => item.id !== carrinho.id)
                );
            })

            // Gerar código de pagamento(terceiro paramento) e calcular frete (quarto parametro)
            
            const resultado_compra = await postCompra(cliente.id, valor_total, "asfbasfoasfsavgb asfpsapjf", 10, list_produtos, endereco)
                if (resultado_compra?.success){
                    showAlert(`Compra Feita com Sucesso`, "success");
                    navigate("/Pagamento", {
                        state: {
                            compra: resultado_compra.compra
                        }
                    })
                } else {
                    showAlert(`Compra não Feita, Falhou`, "erro");
                }
        }

    return(
        <>
            {loading == true ? <Loading/> :
            <>
            <Header status={status}></Header>
            <div className="content-carrinho">
                <div className="center-carrinho">
                    <div className="titulo-carrinho">
                        <h1>Seu Carrinho de Compras</h1>
                        <p>Preço</p>
                    </div>
                    <div className="produtos-carrinho">
                        {produtos_carrinho.map((carrinho, index)=>(
                            <ProdutoHorizontal props={carrinho.produto} key={index}>
                                <div className="contador">

                                    <button onClick={() => alterarQuantidade(carrinho.id, carrinho.qnt_produto +1)}>+</button>

                                    <p>{carrinho.qnt_produto}</p>

                                    <button 
                                        onClick={() => alterarQuantidade(carrinho.id, carrinho.qnt_produto -1)}
                                        disabled={(carrinho.qnt_produto) === 1}
                                    >
                                        -
                                    </button>
                                </div>
                                <MdDelete  onClick={()=>(handleExcluir(carrinho.id))}/>
                                {(carrinho.presente_para) && 
                                <div className="presenteado">
                                    <img src={Presente} alt="Presente Icon" />
                                    <p>Presente para: {carrinho.cliente_presenteado.nome}</p>
                                </div> }
                            </ProdutoHorizontal>
                        ))}
                    </div>
                    <div className="endereco">
                        <p>Enviando para: </p>
                        <select name="endereco" onChange={(e)=>setEndereco(e.target.value)} ref={selectRef}>
                            <option value="">Selecionar Endereço</option>
                            {cliente?.enderecos.map((endereco)=>(
                                <option value={endereco.id}>{endereco.rua}, {endereco.numero} - {endereco.cidade} / {endereco.estado}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="right-carrinho">
                    <div className="total-carrinho">
                        <h4>Subtotal(Quantidade de Produtos):</h4>
                        <p>{valor_total}</p>
                        <button onClick={handlecomprar}>Comprar</button>
                    </div>
                    <div className="produtos-recomendados">
                        <h4>Você pode gostar: </h4>
                        {ProdutosRecomendados.map((produto, index)=>(
                            <ProdutoHorizontal props={produto} key={index}>
                                <button className='adicionar' onClick={() => handlecarrinho(produto.id)}>
                                    Adicionar ao Carrinho
                                </button>
                            </ProdutoHorizontal>
                        ))}
                    </div>
                </div>
            </div>
            <Footer></Footer>
        </>} </>

    )}