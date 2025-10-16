import './Header.css';
import "../Cores.css";
import Bal_Logo from '../../assets/BALstore.png';
import User from '../../assets/user_lojista.png';


export default function Header_Lojist({user_name}) {
    return (
        <>
            <header className='header'>
                <img src={Bal_Logo} alt="BALSTORE_icon" className='BAL-icon'/>
                    <nav>
                        <ul className='nav-list'>
                            <li><a href="" className='nav-link'>Meus produtos</a></li>
                            <li><a href="" className='nav-link'>Pedidos</a></li>
                            <li><a href="" className='nav-link'>Configurações</a></li>
                            <li><a href="" className='nav-link'>Sobre nós</a></li>
                            <li><a href="" className='nav-link'>Logout</a></li>
                        </ul>
                    </nav>
                <div className="perfil">
                    <img src={User} alt="User_icon" className='user_image'/>
                    <p className='user_name'>{user_name}</p>
                </div>
            </header>
        </>
    )
};