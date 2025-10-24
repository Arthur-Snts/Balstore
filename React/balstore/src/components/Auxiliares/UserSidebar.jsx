import user_icon from '../../assets/user-icon-default.png'
import './UserSidebar.css'

export default function UserSidebar ({props}) {
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
                    <button className="side-menu-button"><a href=" ">Minhas Compras</a></button>
                    <button className="side-menu-button"><a href=" ">Configurações de conta</a></button>
                    <button className="side-menu-button"><a href=" ">Lista de desejos</a></button>
                    <button className="side-menu-button"><a href=" ">Lista de amigos</a></button>
                    <button className="side-menu-button"><a href=" ">Sair da conta</a></button>
                </div>
            </aside>
        </>
    )
}