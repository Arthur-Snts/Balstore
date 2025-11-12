import Header from "../components/Header_and_Footer/Header"
import Footer from "../components/Header_and_Footer/Footer"
import { useState, useEffect } from "react";
import user_big_icon from "../assets/user-icon-default.png"
import Sidebar from "../components/Auxiliares/UserSidebar"
import EditarCliente from "../components/Cliente/EditarCliente"
import Endereços from "../components/Cliente/Endereco"
import "./ConfigCliente.css"

export default function ConfigContaCliente(){
    useEffect(() => {
        document.title = "Configuração de conta";
    }, []);

    const status = "guest";

    const user_teste ={
        nome_user : "Ana Maria Alice da Conceição",
        num_amigos : 12
    };
    const user_edit ={
        nome : "Ana Maria Alice da Conceição",
        email: "anamaria@gmail.com"
    };
    const enderecos = {
        rua: "Alceu Valença",
        numero: "20",
        bairro: "Peneirão",
        cidade: "João Picanha",
        uf: "RJ",
        cep: "56700-000"
    }

    const [state, setState] = useState("Profile")

    return(
        <>
            <Header status={status}/>
            <div className="config-page">
                <aside className="user-side-config">
                    <Sidebar props={user_teste} active={"Configurações"}/>
                </aside>
                <section className="user-config-and-address">
                    <div className="links-profile-or-address">
                        <a onClick={()=> setState("Profile")} className={state === "Profile"? "active": "inactive"}>Editar Perfil</a>
                        <a onClick={()=> setState("Address")} className={state === "Address"? "active": "inactive"}>Endereços</a>
                    </div>
                    <div className="image-and-content">
                        {state === "Profile" ? <EditarCliente props={user_edit}/> : <Endereços enderecos={enderecos}/>}
                    </div>         
                </section>
            </div>

            <Footer />
        </>

    )
}