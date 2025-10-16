import './Header.css';
import "../Cores.css"
import Bal_Logo from '../../assets/BALstore.png';
import Carrinho from '../../assets/carrinho-logo-balstore.png'


export default function Header_Lojist() {
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
                <img src={Carrinho} alt="BALSTORE_carrinho" className='BAL-carrinho'/>
            </header>
        </>
    )
};