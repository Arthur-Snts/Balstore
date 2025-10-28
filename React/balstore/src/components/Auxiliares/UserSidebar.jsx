import user_icon from '../../assets/user-icon-default.png'
import './UserSidebar.css'

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
                    <a className={active === "Minhas Compras" ? 'side-menu-button active-button-side': 'side-menu-button'}  href=" ">Minhas Compras</a>
                    <a className={active === "Configurações" ? 'side-menu-button active-button-side': 'side-menu-button'} href=" ">Configurações de conta</a>
                    <a className={active === "Lista de Desejos" ? 'side-menu-button active-button-side': 'side-menu-button'} href=" ">Lista de desejos</a>
                    <a className={active === "Lista de Amigos" ? 'side-menu-button active-button-side': 'side-menu-button'} href=" ">Lista de amigos</a>
                    <a className={active === "Sair da Conta" ? 'side-menu-button active-button-side': 'side-menu-button'} href=" ">Sair da conta</a>
                </div>
            </aside>
        </>
    )
}