import Header from "../components/Header_and_Footer/Header"
import Footer from "../components/Header_and_Footer/Footer"
import Loading from "./Loading"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {getproduto, verificar_token_cliente, verificar_token_loja, getprodutos, postcarrinho, postfavorito, deletefavorito, postCompra, putproduto} from "../statements"
import { useParams } from 'react-router-dom';
import { useAlert } from "../components/Auxiliares/AlertContext"
import { EstrelasAvaliacao, Favoritos } from '../components/Auxiliares/Icones'
import produtos from "./produtos_teste"
import ProdutoCard from "../components/Produtos/ProdutoCard"
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import user_icon from "../assets/user-icon-default.png"


import "./ProdutoInd.css"

export default function ProdutoInd () {

    const navigate = useNavigate();
    const [cliente, setCliente] = useState(null)
    const [loja, setLoja] = useState(null)
    const [loading, setLoading] = useState(true)
    const { id } = useParams();

    const [status, setStatus] = useState("")
    const [produto, setProduto] = useState(null)
    const [produtos, setProdutos] = useState([])
    const [endereco, setEndereco] = useState(null)
    const { showAlert } = useAlert()
    

    useEffect(() => {

        
        async function carregarUsuario() {
            let token = localStorage.getItem("token");
            let token_loja = localStorage.getItem("token_loja")
            if (token){
                const user_devolvido = await verificar_token_cliente(navigate);
                
                setCliente(user_devolvido);
                setStatus("client")
            }
                else if (token_loja){
                    showAlert(`Você precisa estar conectado como Cliente ou desconectado para acessar essa página` , "info");
                    navigate("/Login")
                }
                else {
                    setStatus("guest")
                }
            
            
             setLoading(false)
        }

        
        carregarUsuario();
       
    }, []);

    useEffect(()=>{
        async function carregarproduto() {
                
            const resultado_produto = await getproduto(id)
            
            if (resultado_produto?.success){
                setProduto(resultado_produto.produto)
            } else {
                showAlert("Falha ao Carregar Produto", "erro")
            }
            
            const resultado_produtos = await getprodutos()
                
                if (resultado_produtos?.success){
                    setProdutos(resultado_produtos.produtos)
                }
        }
        carregarproduto()
    }, [cliente, id])

    

    const [count, setCount] = useState(1)

    useEffect(() => {
        document.title = "Produto " + produto?.nome;
    }, [produto]);

    const [produtosFiltrados, setProdutosFiltrados] = useState([])

    useEffect(() => {
        if (produtosFiltrados && produto) {
            setProdutosFiltrados(
                produtos.filter(p => p.categoria.nome === produto.categoria.nome)
                );
        }
    }, [produtos, produto]);

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        centerMode: true,
        slidesToShow: 6,
        slidesToScroll: 3,
        centerPadding: "40px", 
        responsive: [
        { breakpoint: 1650, settings: { slidesToShow: 5 } },
        { breakpoint: 1300, settings: { slidesToShow: 2 } },
        { breakpoint: 480, settings: { slidesToShow: 1 } },
        ],
    };
    
        function NextArrow(props) {
            const { onClick } = props;
            return (
                <div className="custom-arrow next" onClick={onClick}>
                    <FaArrowRight size={30} />
                </div>
            );
        }
        
        function PrevArrow(props) {
            const { onClick } = props;
            return (
                <div className="custom-arrow prev" onClick={onClick}>
                    <FaArrowLeft size={30} />
                </div>
            );
        }


        async function handlefavoritar (id) {
                if (status == "guest"){
                    showAlert("Você precisa estar conectado como Cliente para favoritar um produto", "info");
                    navigate("/Login");
                    return;
                }
        
                if (!cliente || !cliente.favoritos) {
                    showAlert("Erro: dados do cliente não carregados", "error");
                    return;
                }
        
                const favoritoExistente = cliente.favoritos.find(f => f.produto_id === id);
        
                if (favoritoExistente) {
                    const resultado_delete = await deletefavorito(favoritoExistente.id);
                    if (resultado_delete?.success) {
                    
                    setCliente(prev => ({
                        ...prev,
                        favoritos: prev.favoritos.filter(f => f.id !== favoritoExistente.id)
                    }));
                    }return;
                }
                
                const resultado_favoritar = await postfavorito(id, cliente.id);
                if (resultado_favoritar?.success){
                    
                    setCliente(prev => ({
                    ...prev,
                    favoritos: [
                        ...prev.favoritos,
                        {
                            id: resultado_favoritar.favorito.id,
                            produto_id: id,
                            cliente_id: cliente.id
                        }
                    ]
                }));
                }
            }

    async function handlecarrinho(id) {
            const qnt = count || 1;  // 🔥 pega quantidade individual
            if (!cliente){
                showAlert(`Conecte-se antes de colocar no carrinho`, "info");
                return;
            }
    
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

    async function gerarPix( cli_cpf, cli_nome, cli_email, valor) {
        
        const res = await fetch("http://localhost:8080/pix/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            cli_nome:cli_nome,
            cli_email:cli_email,
            cli_cpf:cli_cpf,
            amount: valor })
        });
        const data = await res.json();
        
        
        return data.qr_codes[0].links[0].href;
    }

    async function handlecomprar() {
            setLoading(true)
            if (!cliente){
                showAlert(`Conecte-se antes de Comprar`, "info");
                setLoading(false)
                return;
            }
            if (!endereco){
                showAlert(`Selecione um Endereço Primeiro`, "info");
                setLoading(false)
                return;
            }
                var list_produtos = []
                
                    
                if (count > produto.estoque){
                    showAlert(`O Produto não está disponível na quantidade desejada`, "info");
                    setLoading(false)
                    return;
                }

                list_produtos.push(produto.id)

                const novoEstoque = produto.estoque - count;
                const produtoEditar = {
                    estoque: novoEstoque
                };
                const resultado_putproduto = await putproduto(produto.id, produtoEditar, null)
                if (!resultado_putproduto?.success){
                        showAlert(`Falha ao Atualizar Estoque do Produto`, "erro");
                        return;
                    }
                setProduto(prev => ({
                    ...prev,
                    estoque: novoEstoque
                }));

                let valor_total = 0

                if (produto.promocao > 0){
                    valor_total = count*Number(produto.preco-((produto.promocao/100)*produto.preco))
                } else {
                    valor_total = count*produto.preco
                }
                
                
                
                const qrcode =  await gerarPix(cliente.cpf, cliente.nome, cliente.email, valor_total)
                // Gerar código de pagamento(terceiro paramento) e calcular frete (quarto parametro)
                
                const resultado_compra = await postCompra(cliente.id, valor_total, qrcode, 10, list_produtos, endereco)
                    if (resultado_compra?.success){
                        setLoading(false)
                        showAlert(`Compra Feita com Sucesso`, "success");
                        navigate("/Pagamento", {
                            state: {
                                compra: resultado_compra.compra
                            }
                        })
                    } else {
                        setLoading(false)
                        showAlert(`Compra não Feita, Falhou`, "erro");
                    }
            }
        
    const handleLoja = () => {
        navigate("/Loja", {
                state: {
                    loja: produto.loja.id
                }
            })
    }

    const [avaliacao_total, setAvaliacao_total] = useState(0)

    useEffect(() => {
        if (!produto || !produto.comentarios) return;

        if (produto.comentarios.length === 0) {
            setAvaliacao_total(0);
            return;
        }

        const soma = produto.comentarios.reduce(
            (total, c) => total + Number(c.avaliacao), 
            0
        );

        setAvaliacao_total(soma / produto.comentarios.length);
    }, [produto]);

    if (loading) return <Loading />;
    if (!produto) return <Loading/>


    return(
        <>
        
            <Header status={status}></Header>

                <div className="produto-mostrar">
                    <img src={`http://localhost:8080${produto.imagem_path}`} alt={produto.nome} />
                    <div className="produto-informacao">
                        <div className="titulo-produto">
                            <h3>{produto.nome}</h3>
                            <EstrelasAvaliacao rating = {avaliacao_total} />
                            <p>{produto.estoque} Em Estoque</p>
                            <p style= {{cursor:"pointer"}}onClick={handleLoja}>{produto.loja.nome}</p>
                        </div>
                        <div className="frete">
                            <p>Endereço: {produto.frete}</p>
                            <select name="endereco" onChange={(e)=>setEndereco(e.target.value)}>
                                <option value="">Selecionar Endereço</option>
                                {cliente?.enderecos.map((endereco)=>(
                                    <option value={endereco.id}>{endereco.rua}, {endereco.numero} - {endereco.cidade} / {endereco.estado}</option>
                                ))}
                            </select>
                        </div>
                        <div className="valores-produto">
                            <div className="contagem">
                                <p>Quantidade:</p>
                                <div className="contador">
                                    <button onClick={()=>(setCount(count-1))} disabled={count == 1 ? true: false}>-</button>
                                    <p>{count}</p>
                                    <button onClick={()=>(setCount(count+1))}>+</button>
                                </div>
                            </div>
                            

                            {produto.promocao > 0 
                            ?
                            <p className="produto-preco">R$ {(produto.preco - ((Number(produto.promocao)/100) *produto.preco)).toFixed(2)}</p>
                            :
                            <p className="produto-preco">R$ {produto.preco.toFixed(2)}</p>
                            }
                        </div>

                        <div className="produto-buttons">
                            <button className="button_amarelo" onClick={()=>(handlecarrinho(produto.id))}>Adicionar ao Carrinho</button>
                            <button className="button_azul" onClick={handlecomprar}>Comprar</button>
                        </div>
                    </div>
                    
                </div>
                <div className="carrossel_categoria"><h3>Você também pode gostar:</h3> 
                <Slider {...settings} className="carrossel-produtos">
                        {produtosFiltrados.map((produto)=> (
                                <ProdutoCard produto={produto} favoritoInicial={status !== "guest" && cliente?.favoritos?.some(f => f.produto_id === produto.id)} onclickFavoritar={handlefavoritar}></ProdutoCard>
                        ))}
                    </Slider></div>
                
                <div className="comentarios">
                    <div className="header-comentarios">
                        <p>Avaliações do Produto</p>
                        <EstrelasAvaliacao rating = {avaliacao_total} />
                    </div>
                    {produto.comentarios.map((comentario)=> (
                        <div className="comentario">
                            <div className="usuario-comentario">
                                <img src={user_icon} alt="User icon" />
                                <div className="nome-comentario">
                                    <p>{comentario.cliente.nome}</p>
                                    <p>{comentario.cliente.email}</p>
                                </div>
                            </div>
                           <div className="comentario-conteudo">
                                <p>{comentario.conteudo}</p>
                                 <EstrelasAvaliacao rating = {comentario.avaliacao} />
                                
                            </div>  
                        <div className="linha-divisoria"></div>
                           
                            
                        </div>
                    ))}
                </div>
            <Footer></Footer>
        </>
    )
    
}