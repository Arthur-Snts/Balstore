import Header from '../components/Header_and_Footer/Header';
import Footer from '../components/Header_and_Footer/Footer';
import Carrossel from '../components/Auxiliares/Carrossel';
import Categorias from '../components/Auxiliares/Categorias';
import CarrosselProdutos from '../components/Auxiliares/CarrosselProdutos';
import "./MainPage.css";
import ProdutoCard from '../components/Produtos/ProdutoCard';
import { useAlert } from "../components/Auxiliares/AlertContext";
import { useEffect,useState } from 'react';
import {deletefavorito, getprodutos, postfavorito, verificar_token_cliente, verificar_token_loja} from "../statements"
import { useLocation, useNavigate } from 'react-router-dom';
import { getcategorias } from '../statements';
import LoadingScreen from './Loading';




export default function MainPage() {

    useEffect(() => {
        document.title = "Balstore";
    }, []);

    const navigate = useNavigate();
    const [cliente, setCliente] = useState(null)
    const [loja, setLoja] = useState(null)
    const [loading, setLoading] = useState(true)

    const [status, setStatus] = useState("")
    const [categorias, setCategorias] = useState([]);
    const [produtos, setProdutos] = useState([]);

    useEffect(() => {
        async function carregar() {
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



                const resultado_categorias = await getcategorias();
                if (resultado_categorias?.success === true) {
                    setCategorias(resultado_categorias.categorias);
                    
                }
                
                const resultado_produtos = await getprodutos();
                if (resultado_produtos?.success === true) {
                    setProdutos(resultado_produtos.produtos)
                }

                setLoading(false)
        }
        carregar();
        
    }, []);

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
    

    const categoria = categorias[Math.floor(Math.random() * categorias.length)];

    const produtosFiltrados = produtos.filter(
        (produto) => produto.categoria === categoria.nome
    );

    const { showAlert } = useAlert();

    return (
        <>
            {loading == true ? <LoadingScreen/>: 
            <>
            <Header status={status} user_name={loja?.nome}/>
                <Carrossel/>
                <Categorias/>
                <div className="categoria-recomendada">
                    <div className="titulo-categoria-recomendada">
                        <p>Categoria {categoria?.nome}</p>
                    </div>
                    <CarrosselProdutos produtosFiltrados={produtosFiltrados}></CarrosselProdutos>
                </div>
                <div className="recomendados">
                    <div className="titulo-categoria-recomendada">
                        <p>Produtos Recomendados</p>
                    </div>
                    <div className="produtos_todos">
                        {produtos.map((produto)=> (
                            <ProdutoCard produto={produto} favoritoInicial={status !== "guest" && cliente?.favoritos?.some(f => f.produto_id === produto.id)} onclickFavoritar={handlefavoritar}></ProdutoCard>
                        ))}
                    </div>
                </div>
            <Footer/>
        </>}</>

    )
}