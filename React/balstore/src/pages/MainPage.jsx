import Header from '../components/Header_and_Footer/Header';
import Footer from '../components/Header_and_Footer/Footer';
import Carrossel from '../components/Auxiliares/Carrossel';
import Categorias from '../components/Auxiliares/Categorias';
import CarrosselProdutos from '../components/Auxiliares/CarrosselProdutos';
import "./MainPage.css";
import ProdutoCard from '../components/Produtos/ProdutoCard';
import { useAlert } from "../components/Auxiliares/AlertContext";
import { useEffect,useState } from 'react';
import {verificar_token_cliente, verificar_token_loja} from "../statements"
import produtos_todos from "./produtos_teste"; //Substituir por consulta no banco
import { useLocation, useNavigate } from 'react-router-dom';




export default function MainPage() {

    useEffect(() => {
        document.title = "Balstore";
    }, []);

    const navigate = useNavigate();
    const [cliente, setCliente] = useState(null)
    const [loja, setLoja] = useState(null)
    const [loading, setLoading] = useState(false)

    const [status, setStatus] = useState("")

    useEffect(() => {

        setLoading(true)
        async function carregarUsuario() {
            let token = localStorage.getItem("token");
            let token_loja = localStorage.getItem("token_loja")
            if (token){
                const user_devolvido = await verificar_token_cliente(navigate);
                
                setCliente(user_devolvido);
                setStatus("client")
            }
                else if (token_loja){
                    showAlert("Você precisa estar conectado como Cliente ou desconectado para acessar essa página", "info");
                    navigate("/Login") 
                }
                else {
                    setStatus("guest")
                }
        }
        carregarUsuario();
        setLoading(false)
    }, []);

    const categorias = [
        "Brinquedos", "Cosméticos", "Esporte", "Roupas", "Eletrônicos", "Papelaria", "Bolsas", "Calçados", "Cozinha", 
        "Móveis", "Ferramentas", "Limpeza", "Livros"
    ] // Substituir por consulta ao banco

    const categoria = categorias[Math.floor(Math.random() * categorias.length)];

    const produtosFiltrados = produtos_todos.filter(
        (produto) => produto.categoria === categoria
    );

    const { showAlert } = useAlert();

    return (
        <>

            {alert && (<Alert tipo={alert.tipo} mensagem={alert.mensagem}/>)}
            <Header status={status} user_name={loja?.nome}/>
                <Carrossel/>
                <Categorias/>
                <div className="categoria-recomendada">
                    <div className="titulo-categoria-recomendada">
                        <p>Categoria {categoria}</p>
                    </div>
                    <CarrosselProdutos produtosFiltrados={produtosFiltrados}></CarrosselProdutos>
                </div>
                <div className="recomendados">
                    <div className="titulo-categoria-recomendada">
                        <p>Produtos Recomendados</p>
                    </div>
                    <div className="produtos_todos">
                        {produtos_todos.map((produto)=> (
                            <ProdutoCard produto={produto} favorito={false //Substituir caso esteja logado}
                            }></ProdutoCard>
                        ))}
                    </div>
                </div>
            <Footer/>
        </>

    )
}