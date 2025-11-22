import "./NotFound.css";
import Header from "../components/Header_and_Footer/Header";
import Loading from "./Loading"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {verificar_token_cliente, verificar_token_loja} from "../statements"
import Footer from "../components/Header_and_Footer/Footer";

export default function NotFound() {

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
                    const loja_devolvida = await verificar_token_loja(navigate);
                
                    setLoja(loja_devolvida);
                    setStatus("lojist")
                }
                else {
                    setStatus("guest")
                }
        }
        carregarUsuario();
        setLoading(false)
    }, []);

    useEffect(() => {
        document.title = "Página não Encontrada";
    }, []);


  return (
    <>
      <Header status={status} user_name={loja?.nome}></Header>
        <div className="notfound-container">
          <h1 className="notfound-code">404</h1>
          <p className="notfound-text">Página não encontrada</p>

          <a href="/" className="notfound-button">
            Voltar ao início
          </a>
        </div>
      <Footer></Footer>
    </>
  );
}