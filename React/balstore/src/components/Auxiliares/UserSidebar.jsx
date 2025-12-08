import { useEffect, useState } from 'react'
import user_icon from '../../assets/user-icon-default.png'
import './UserSidebar.css'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { FaBars, FaTimes } from "react-icons/fa";

export default function UserSidebar ({props, active}) {

    const navigate = useNavigate()
    const [open, setOpen] = useState(false)


    const handleLogout = () => {
        localStorage.removeItem("token_loja");
        localStorage.removeItem("refresh_token_loja");
        localStorage.removeItem("token");
        localStorage.removeItem("refresh_token");
        navigate("/")
    }
    const [count, setCount] = useState(0)
     useEffect(() => {
            if (!props) return;

            let novoCount = 0;

            props?.amigos_enviados?.forEach(amigo => {
                if (amigo.solicitacao === "Aceito" && amigo.amigo_de === props.id) {
                    novoCount++;
                }
            });

            props?.amigos_recebidos?.forEach(amigo => {
                if (amigo.solicitacao === "Aceito" && amigo.amigo === props.id) {
                    novoCount++;
                }
            });

            setCount(novoCount);
        }, [props]);
    
    

    return (
        <>
             <button 
                className="menu-btn"
                onClick={() => setOpen(prev => !prev)}
            >
                ☰
            </button>

            
            <aside className={`barra-lateral-user ${open ? 'open' : ''}`}>
            
                <br />
                <div className="user-icon-and-text">
                    <img src={user_icon} alt="icon-user-default"/>
                        <div className='user-text'>
                            <p className="user-name">{props?.nome}</p>
                            <p className="qtd-amigos">Amigos: {count}</p>
                        </div>
                        
                </div>
                <div className="sidebar-menu">
                    <Link className={active === "Minhas Compras" ? 'side-menu-button active-button-side': 'side-menu-button'}  to="/Perfil/Compras" onClick={() => setOpen(false)}>Minhas Compras</Link>
                    <Link className={active === "Configurações" ? 'side-menu-button active-button-side': 'side-menu-button'} to="/Perfil/Config" onClick={() => setOpen(false)}>Configurações de conta</Link>
                    <Link className={active === "Lista de Desejos" ? 'side-menu-button active-button-side': 'side-menu-button'} to="/Perfil/Favoritos" onClick={() => setOpen(false)}>Lista de desejos</Link>
                    <Link className={active === "Lista de Amigos" ? 'side-menu-button active-button-side': 'side-menu-button'} to="/Perfil/Amizades" onClick={() => setOpen(false)}>Lista de amigos</Link>
                    <a className={active === "Sair da Conta" ? 'side-menu-button active-button-side': 'side-menu-button'} onClick={() => { handleLogout(); setOpen(false); }}>Sair da conta</a>
                </div>
            </aside>
        </>
    )
}