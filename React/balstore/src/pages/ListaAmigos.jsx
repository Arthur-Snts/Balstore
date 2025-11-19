import Header from "../components/Header_and_Footer/Header"
import Footer from "../components/Header_and_Footer/Footer"
import UserSidebar from "../components/Auxiliares/UserSidebar"
import Modal from "../components/Auxiliares/Modal"
import { useEffect, useState } from "react"
import { LuMailPlus } from "react-icons/lu";
import { IoIosNotifications } from "react-icons/io";

import "./ListaAmigos.css"

export default function ListaAmigos () {

    const status = "client"

    const user = {
        "nome_user": "Joaquina",
        "nmr_amigos": 13
    }

    useEffect(() => {
        document.title = "Lista de Amigos";
    }, []);

    
        const [isOpen, setIsOpen] = useState(false);
        const [isOpenExcluir, setIsOpenExcluir] = useState(false);
        const [isOpenSolitations, setIsOpenSolitations] = useState(false);
        const [AmizadeSelecionada, setAmizadeSelecionada] = useState(null);
        
    

        const abrirModalExcluir = (amizade) => {
            setAmizadeSelecionada(amizade);
            setIsOpenExcluir(true);
        };

    

    return(
        <>
            {/* Modal Adicionar Amigo*/}
            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
                <h3>Adicionar Amigo</h3>
                <p>Busca por nome ou email</p>
                <input type="text" placeholder="Nome ou Email do Amigo" className="pesquisa-amigo" />

                Fazer um map nas pesquisas
                <div className="amigo-pesquisado">
                    
                </div>
                
            </Modal>

            {/* Modal Solicitações */}
            <Modal isOpen={isOpenSolitations} onClose={() => setIsOpenSolitations(false)}>
                <h3>Solicitações Pendentes</h3>
                <p>Aceite ou Negue Solicitações enviadas para você</p>

                Fazer um map nas solicitações
                <div className="amigo-solitacao">
                    
                </div>
            </Modal>

            {/* Modal Excluir */}
            <Modal isOpen={isOpenExcluir} onClose={() => setIsOpenExcluir(false)}>
                <h3>Remover amizade com Fulaninho da XJ?</h3>
                
                
                <div className="buttons-modal">
                    <button className="confirm-button" onClick={() => setIsOpenExcluir(false)}>Cancelar</button>
                    <button className="cancel-button" >Confirmar</button>
                </div>
            </Modal>

        
            <Header status={status} active={"Perfil"}></Header>
            <div className="amigos-content">
                <aside className="user-side-config">
                    <UserSidebar props={user} active={"Lista de Amigos"}/>
                </aside>
                <div className="listagem-amigos">
                    <div className="busca">
                        <div className='search-product'>
                            <i className="fa fa-search"></i>
                            <input type="text"  placeholder="Pesquisar Pedido da sua Loja"/>
                        </div>
                        <LuMailPlus onClick={()=>(setIsOpen(true))}/>
                        <IoIosNotifications  onClick={()=>setIsOpenSolitations(true)}/>
                    </div>
                    <div className="amigos">
                        Fazer um map em amigos
                    </div>
                </div>
                
            </div>
            <Footer></Footer>
        </>
    )

}