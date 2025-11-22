import Header from "../components/Header_and_Footer/Header"
import Footer from "../components/Header_and_Footer/Footer"
import { useState, useEffect } from "react";
import Sidebar from "../components/Auxiliares/UserSidebar"
import EditarCliente from "../components/Cliente/EditarCliente"
import Endereços from "../components/Cliente/Endereco"

import Loading from "./Loading"
import { useNavigate } from "react-router-dom"
import {verificar_token_cliente, verificar_token_loja} from "../statements"
import "./ConfigCliente.css"

export default function ConfigContaCliente(){
    useEffect(() => {
        document.title = "Configuração de conta";
    }, []);

    const navigate = useNavigate();
    const [cliente, setCliente] = useState(null)
    const [loja, setLoja] = useState(null)
    const [loading, setLoading] = useState(true)

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
                    navigate("/Login", {state: {
            alert: { tipo: "aviso", mensagem: `Você precisa estar conectado como Cliente para acessar essa página` }
        }})
                }
        }
        carregarUsuario();
        setLoading(false)
    }, []);

    

    const [state, setState] = useState("Profile")

    return(
        <> {loading == true ? <Loading/> :
            <>
            <Header status={status} active="Perfil" user_name={loja?.nome}/>
            <div className="config-page">
                <aside className="user-side-config">
                    <Sidebar props={cliente} active={"Configurações"}/>
                </aside>
                <section className="user-config-and-address">
                    <div className="links-profile-or-address">
                        <a onClick={()=> setState("Profile")} className={state === "Profile"? "selected": "unselected"}>Editar Perfil</a>
                        <a onClick={()=> setState("Address")} className={state === "Address"? "selected": "unselected"}>Endereços</a>
                    </div>
                    <div className="image-and-content">
                        {state === "Profile" ? <EditarCliente props={cliente}/> : <Endereços enderecos={cliente?.enderecos}/>}
                    </div>         
                </section>
            </div>
            <Footer />
            </>}

            
        </>

    )
}