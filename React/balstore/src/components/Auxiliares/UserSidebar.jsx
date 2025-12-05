import { useEffect, useState } from 'react'
import user_icon from '../../assets/user-icon-default.png'
import './UserSidebar.css'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

export default function UserSidebar ({props, active}) {

    const navigate = useNavigate()


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
            <aside className="barra-lateral-user">
                <br />
                <div className="user-icon-and-text">
                    <img src={user_icon} alt="icon-user-default"/>
                        <div className='user-text'>
                            <p className="user-name">{props?.nome}</p>
                            <p className="qtd-amigos">Amigos: {count}</p>
                        </div>
                        
                </div>
                <div className="sidebar-menu">
                    <Link className={active === "Minhas Compras" ? 'side-menu-button active-button-side': 'side-menu-button'}  to="/Perfil/Compras">Minhas Compras</Link>
                    <Link className={active === "Configurações" ? 'side-menu-button active-button-side': 'side-menu-button'} to="/Perfil/Config">Configurações de conta</Link>
                    <Link className={active === "Lista de Desejos" ? 'side-menu-button active-button-side': 'side-menu-button'} to="/Perfil/Favoritos">Lista de desejos</Link>
                    <Link className={active === "Lista de Amigos" ? 'side-menu-button active-button-side': 'side-menu-button'} to="/Perfil/Amizades">Lista de amigos</Link>
                    <a className={active === "Sair da Conta" ? 'side-menu-button active-button-side': 'side-menu-button'} onClick={handleLogout}>Sair da conta</a>
                </div>
            </aside>
        </>
    )
}