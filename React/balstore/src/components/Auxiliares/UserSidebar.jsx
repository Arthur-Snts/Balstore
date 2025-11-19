import user_icon from '../../assets/user-icon-default.png'
import './UserSidebar.css'
import { Link } from 'react-router-dom'

export default function UserSidebar ({props, active}) {
    return (
        <>
            <aside className="barra-lateral-user">
                <br />
                <div className="user-icon-and-text">
                    <img src={user_icon} alt="icon-user-default"/>
                        <div className='user-text'>
                            <p className="user-name">{props.nome_user}</p>
                            <p className="qtd-amigos">Amigos: {props.num_amigos}</p>
                        </div>
                        
                </div>
                <div className="sidebar-menu">
                    <Link className={active === "Minhas Compras" ? 'side-menu-button active-button-side': 'side-menu-button'}  to="/Perfil/Compras">Minhas Compras</Link>
                    <Link className={active === "Configurações" ? 'side-menu-button active-button-side': 'side-menu-button'} to="/Perfil/Config">Configurações de conta</Link>
                    <Link className={active === "Lista de Desejos" ? 'side-menu-button active-button-side': 'side-menu-button'} to="/Perfil/Favoritos">Lista de desejos</Link>
                    <Link className={active === "Lista de Amigos" ? 'side-menu-button active-button-side': 'side-menu-button'} to="/Perfil/Amizades">Lista de amigos</Link>
                    <a className={active === "Sair da Conta" ? 'side-menu-button active-button-side': 'side-menu-button'}>Sair da conta</a>
                </div>
            </aside>
        </>
    )
}