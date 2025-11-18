import './Header.css';
import "../Cores.css"
import Bal_Logo from '../../assets/BALstore.png';
import Carrinho from '../../assets/carrinho-logo-balstore.png'
import User from '../../assets/user_lojista.png';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';


export default function Header({status, user_name, active}) {

    

    return (
        <header className='header'>
            {status === "guest" && <Header_Guest active={active} />}
            {status === "client" && <Header_Client active={active}/>}
            {status === "lojist" && <Header_Lojist user_name={user_name} active={active}/>}
        </header>
    )
};

function Header_Client ({active}){

    const navigate = useNavigate();
    const [texto, setTexto] = useState("");

    const handleNavigate = (e) => {
        e.preventDefault(); 
        navigate(`/Pesquisa?q=${texto}`);
    };
    return(
        <>  
            <Link to="/">
                <img src={Bal_Logo} alt="BALSTORE_icon" className='BAL-icon'/>
            </Link>
            <form className='search' onSubmit={handleNavigate}>
                <i className="fa fa-search"></i>
                <input type="search" className='search-bar' placeholder='Pesquisar...' onChange={(e) => setTexto(e.target.value)} value={texto}/>
            </form>
            <nav>
                <ul className='nav-list'>
                    <li><Link to="/Perfil/Compras" className={active=== "Perfil"? 'nav-link active-nav-button': 'nav-link'}>Perfil</Link></li>
                    <li><Link to="/Login" className={active=== "Minha Loja"? 'nav-link active-nav-button': 'nav-link'}>Minha loja</Link></li>
                    <li><Link to="/Sobre" className={active=== "Sobre nós"? 'nav-link active-nav-button': 'nav-link'}>Sobre nós</Link></li>
                </ul>
            </nav>
            <img src={Carrinho} alt="BALSTORE_carrinho" className='BAL-carrinho'/>
        </>)
}

function Header_Guest({active}) {

    const navigate = useNavigate();
    const [texto, setTexto] = useState("");

    const handleNavigate = (e) => {
        e.preventDefault(); 
        navigate(`/Pesquisa?q=${texto}`);
    };
    return(
    <>
        <Link to="/">
            <img src={Bal_Logo} alt="BALSTORE_icon" className='BAL-icon' to="/"/>
        </Link>
        <form className='search' onSubmit={handleNavigate}>
            <i className="fa fa-search"></i>
            <input type="search" className='search-bar' placeholder='Pesquisar...' onChange={(e) => setTexto(e.target.value)} value={texto}/>
        </form>
        
        <nav>
            <ul className='nav-list'>
                <li><Link to="/Cadastro" className={active=== "Sign up"? 'nav-link active-nav-button': 'nav-link'}>Sign up</Link></li>
                <li><Link to="/Login" className={active=== "Sign in"? 'nav-link active-nav-button': 'nav-link'}>Sign in</Link></li>
                <li><Link to="/Sobre" className={active=== "Sobre nós"? 'nav-link active-nav-button': 'nav-link'}>Sobre nós</Link></li>
            </ul>
        </nav>
        <img src={Carrinho} alt="BALSTORE_carrinho" className='BAL-carrinho'/>
    </>)
}

function Header_Lojist ({user_name, active}) {
    return(
    <>
        <Link to="/">
            <img src={Bal_Logo} alt="BALSTORE_icon" className='BAL-icon' to="/"/>
        </Link>
        <nav>
            <ul className='nav-list'>
                <li><Link to="/Loja/Produtos" className={active=== "Meus Produtos"? 'nav-link active-nav-button': 'nav-link'}>Meus produtos</Link></li>
                <li><Link to="/Loja/Pedidos" className={active=== "Pedidos"? 'nav-link active-nav-button': 'nav-link'}>Pedidos</Link></li>
                <li><Link to="/Loja/Editar" className={active=== "Configurações"? 'nav-link active-nav-button': 'nav-link'}>Configurações</Link></li>
                <li><Link to="/Sobre" className={active=== "Sobre nós"? 'nav-link active-nav-button': 'nav-link'}>Sobre nós</Link></li>
                <li><a className={active=== "Logout"? 'nav-link active-nav-button': 'nav-link'}>Logout</a></li>
            </ul>
        </nav>
        <div className="perfil">
            <img src={User} alt="User_icon" className='user_image'/>
            <p className='user_name'>{user_name}</p>
        </div>
    </>)
}

