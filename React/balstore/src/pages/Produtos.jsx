import Header from "../components/Header_and_Footer/Header";
import Footer from "../components/Header_and_Footer/Footer";
import Loading from "./Loading"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { verificar_token_loja, getcategorias} from "../statements"
import ProdutosLojista from "../components/Produtos/ProdutosLojista";
import AdicionarProduto from "../components/Produtos/AdicionarProduto";
import "./Produtos.css"

export default function Produtos() {
  useEffect(() => {
    document.title = "Produto";
  }, []);

  const navigate = useNavigate();
    const [loja, setLoja] = useState(null)
    const [loading, setLoading] = useState(true)
    const [categorias, setCategorias] = useState([])

    const [status, setStatus] = useState("")

    useEffect(() => {

        
        async function carregarUsuario() {
            
            let token_loja = localStorage.getItem("token_loja")
            if (token_loja){
                    const loja_devolvida = await verificar_token_loja(navigate);
                
                    setLoja(loja_devolvida);
                    setStatus("lojist")
                }
                else {
                  showAlert(`Você precisa estar conectado como Loja para acessar essa página` , "info");
                  navigate("/Login")
                }
              const resultado_categorias = await getcategorias()
              setCategorias(resultado_categorias.categorias)

              setLoading(false)
        }
        carregarUsuario();
        
    }, []);
  const [page, setPage] = useState("Produtos")

  if (loading) {
    return <Loading/>
  }

  return (
    <>
      <Header status={status} user_name={loja?.nome} active={"Meus Produtos"}/>

      <div className="container-produtos">

        <div className="botoes_produtos">
          <button className={page == "Produtos"? "active-botao": "botao"} onClick={()=>setPage("Produtos")}>Todos os Produtos</button>
          <button className={page == "Adicionar"? "active-botao": "botao"} onClick={()=>setPage("Adicionar")}>Adicionar produto</button>
        </div>
        {page =="Adicionar"? <AdicionarProduto categorias={categorias} loja_id={loja.id}/>: <ProdutosLojista loja_id={loja.id} />}
  
      </div>

      <Footer />
    </>
  );
}
