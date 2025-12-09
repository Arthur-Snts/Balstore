import UserSidebar from '../components/Auxiliares/UserSidebar'; 
import Header from '../components/Header_and_Footer/Header'; 
import Footer from '../components/Header_and_Footer/Footer'; 
import ProdutoHorizontal from "../components/Produtos/ProdutoHorizontal";
import { Favoritos } from '../components/Auxiliares/Icones';
import { useEffect, useState } from 'react';
import './ListaDesejos.css'; 
import Loading from "./Loading"
import { useAlert } from "../components/Auxiliares/AlertContext";
import { useNavigate } from "react-router-dom"
import {verificar_token_cliente, getproduto, postfavorito, deletefavorito, postcarrinho} from "../statements"

export default function ListaDesejos() {

    useEffect(() => {
        document.title = "Lista de Desejo";
    }, []);
        
    const { showAlert } = useAlert();
    const [produtos_favoritos, setProdutos_favoritos] = useState([]);

    const navigate = useNavigate();
    const [cliente, setCliente] = useState(null);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState("");

    // 🔥 Quantidade individual por produto
    const [quantidades, setQuantidades] = useState({});

    function alterarQuantidade(id, delta) {
        setQuantidades(prev => {
            const atual = prev[id] || 1;
            const novoValor = Math.max(1, atual + delta);
            return { ...prev, [id]: novoValor };
        });
    }

    useEffect(() => {
        setLoading(true);

        async function carregarUsuario() {
            const token = localStorage.getItem("token");

            if (!token) {
                showAlert("Você precisa estar conectado como Cliente para acessar essa página" , "info");
                navigate("/Login");
                setLoading(false);
                return;
            }

            const user_devolvido = await verificar_token_cliente(navigate);
            setCliente(user_devolvido);
            setStatus("client");

            if (user_devolvido.favoritos?.length > 0) {
                for (const favorito of user_devolvido.favoritos) {
                    const resultado = await getproduto(favorito.produto_id);
                    if (resultado.success) {
                        setProdutos_favoritos(prevLista => {
                            const existe = prevLista.some(prod => prod.id === resultado.produto.id);
                            return existe ? prevLista : [...prevLista, resultado.produto];
                        });
                    }
                }
            }

            setLoading(false);
        }

        carregarUsuario();
    }, []);

    useEffect(() => {
        async function syncFavoritos() {
            if (!cliente?.favoritos) return;

            const listaNova = [];

            for (const fav of cliente.favoritos) {
                const res = await getproduto(fav.produto_id);
                if (res.success) {
                    listaNova.push(res.produto);
                }
            }

            setProdutos_favoritos(listaNova);
        }

        syncFavoritos();
    }, [cliente?.favoritos]);

    async function handlefavoritar(id) {
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
            }
            return;
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
        const qnt = quantidades[id] || 1;  // 🔥 pega quantidade individual

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
    if (loading) {return <Loading/>}

    return (   
        <div className="lista-desejos-page">  
            <Header status={status} active={"Perfil"}/>
            <div className="main-content-area">

                <aside className="user-side-config">
                    <UserSidebar props={cliente} active={"Lista de Desejos"}/>
                </aside>    

                <main className="user-profile-content">
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

                                <Favoritos 
                                    favorito={cliente?.favoritos?.some(f => f.produto_id === produto.id)}
                                    setFavorito={() => handlefavoritar(produto.id)}
                                />
                            </div>

                            <button className='adicionar' onClick={() => handlecarrinho(produto.id)}>
                                Adicionar ao Carrinho
                            </button>
                        </ProdutoHorizontal>
                    ))}    
                </main>
            </div>
            <Footer/>
        </div>
    );
}
