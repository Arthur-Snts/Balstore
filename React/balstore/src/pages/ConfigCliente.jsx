import Header from "../components/Header_and_Footer/Header"
import Footer from "../components/Header_and_Footer/Footer"
import { useState, useEffect } from "react";
import "../assets/user-icon-default.png"
import Sidebar from "../components/Cliente/UserSidebar"

export default function ConfigContaCliente(){
    const status = "guest";

    const user_teste ={
        nome_user : "Ana Maria Alice da Conceição",
        num_amigos : 12
    };

    return(
        <>
            <Header status={status}/>
                <aside className="User-side-config">
                    <Sidebar props={user_teste} active={"Configurações"}/>
                </aside>

            <Footer />
        </>

    )
}