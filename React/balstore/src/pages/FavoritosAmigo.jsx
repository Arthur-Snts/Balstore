import Header from "../components/Header_and_Footer/Header";
import Footer from "../components/Header_and_Footer/Footer";
import UserSidebar from "../components/Auxiliares/UserSidebar";
import ProdutoHorizontal from "../components/Produtos/ProdutoHorizontal";
import { Favoritos } from "../components/Auxiliares/Icones";
import { useEffect, useState } from "react";
import Loading from "./Loading";
import { useAlert } from "../components/Auxiliares/AlertContext";
import { useNavigate, useParams } from "react-router-dom";
import { verificar_token_cliente, getfavoritos, getcliente, postcarrinho } from "../statements";
import user_icon from '../assets/user-icon-default.png';
import './ListaDesejos.css';

export default function FavoritosAmigo(){

    const { showAlert } = useAlert();
    const navigate = useNavigate();
    const params = useParams();
    const amigoId = params.id;

    const [cliente, setCliente] = useState(null);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState("");
    const [produtos_favoritos, setProdutos_favoritos] = useState([]);
    const [amigo, setAmigo] = useState(null);
    const [quantidades, setQuantidades] = useState({});

    useEffect(() => {
        document.title = "Favoritos do Amigo";
    }, []);

    useEffect(() => {
        async function carregar() {
            setLoading(true);

            const token = localStorage.getItem("token");
            if (!token){
                showAlert("Você precisa estar conectado como Cliente para acessar essa página", "info");
                navigate("/Login");
                setLoading(false);
                return;
            }

            const user = await verificar_token_cliente(navigate);
            setCliente(user);
            setStatus("client");

            // buscar favoritos do amigo
            if (!amigoId) {
                setProdutos_favoritos([]);
                setLoading(false);
                return;
            }

            // buscar dados do amigo (nome / perfil)
            const amigoRes = await getcliente(amigoId);
            if (amigoRes.success) setAmigo(amigoRes.cliente);

            const res = await getfavoritos(amigoId);
            if (!res.success) {
                setProdutos_favoritos([]);
                setLoading(false);
                return;
            }

            const favs = res.favoritos || [];
            const produtos = favs.map(f => f.produto).filter(Boolean);
            setProdutos_favoritos(produtos);
            setLoading(false);
        }

        carregar();
    }, [amigoId]);

    function alterarQuantidade(id, delta) {
        setQuantidades(prev => {
            const atual = prev[id] || 1;
            const novoValor = Math.max(1, atual + delta);
            return { ...prev, [id]: novoValor };
        });
    }

    async function handlecarrinho(id) {
            const qnt = quantidades[id] || 1; 
    
            const carrinhoExistente = cliente.carrinhos.find(f => f.produto_id === id);
            if (carrinhoExistente){
                if (carrinhoExistente.presente_para == amigoId){
                    showAlert(`Produto já disponível no seu carrinho como presente para essa pesso`, "info");
                    return;}
                
            }
    
            const resultado = await postcarrinho(id, cliente.id, amigo.id, qnt);
    
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

    if (loading) return <Loading />;

    return (
        <div className="lista-desejos-page">
            <Header status={status} active={"Perfil"}/>
            <div className="main-content-area">

                <aside className="user-side-config">
                    <UserSidebar props={cliente} active={"Favoritos do Amigo"}/>
                </aside>

                <main className="user-profile-content">
                    <div className="favoritos-amigo-header" style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'18px', marginTop: "40px"}}>
                        <img src={user_icon} alt="Ícone" style={{width:72,height:72,borderRadius:8,objectFit:'cover'}}/>
                        <div>
                            <h2 style={{margin:0}}>Favoritos de {amigo?.nome || 'Usuário'}</h2>
                            {amigo?.email && <p style={{margin:0,color:'#666'}}>{amigo.email}</p>}
                        </div>
                    </div>
                    {produtos_favoritos.map((produto, index)=>(
                        <ProdutoHorizontal props={produto} key={index}>
                            <div className="contagem">
                                <p>Quantidade:</p>
                                <div className="contador">
                                    <button 
                                        onClick={() => alterarQuantidade(produto.id, -1)}
                                        disabled={(quantidades[produto.id] || 1) === 1}
                                    >
                                        -
                                    </button>

                                    <p>{quantidades[produto.id] || 1}</p>

                                    <button onClick={() => alterarQuantidade(produto.id, +1)}>+</button>
                                </div>
                            </div>

                            <button className='adicionar' onClick={() => handlecarrinho(produto.id)}>
                                Adicionar ao Carrinho
                            </button>

                        </ProdutoHorizontal>
                    ))}
                </main>

            </div>
            <Footer />
        </div>
    );
}
