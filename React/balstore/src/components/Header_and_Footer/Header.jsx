import React from 'react';
import './Header.css';
import "../Cores.css"
import Bal_Logo from '../../assets/BALstore.png';
import Carrinho from '../../assets/carrinho-logo-balstore.png'


export default function Header({status}) {
    return (
        <>
            <header className='header'>
                {status === "guest" && <GuestHeader />}
                {status === "customer" && <CustomerHeader />}
                {status === "seller" && <SellerHeader />}
            </header>
        </>
    )
};

function GuestHeader() {
    return (
        <>
            <img src={Bal_Logo} alt="BALSTORE_icon"  className='BAL-icon'/>
            <div className='search'>
                <i className="fa fa-search"></i>
                <input type="search" className='search-bar' placeholder='Pesquisar...'/>
            </div>
            
            <nav>
                <ul className='nav-list'>
                    <li><a href="" className='nav-link'>Sign up</a></li>
                    <li><a href="" className='nav-link'>Sign in</a></li>
                    <li><a href="" className='nav-link'>Sobre nós</a></li>
                </ul>
            </nav>
            <img src={Carrinho} alt="BALSTORE_carrinho" className='BAL-carrinho'/>
        </>
    )
};

function CustomerHeader() {
    return (
        <>
            <img src={Bal_Logo} alt="BALSTORE_icon" className='BAL-icon'/>
            <div className='search'>
                <i className="fa fa-search"></i>
                <input type="search" className='search-bar' placeholder='Pesquisar...'/>
            </div>
            <nav>
                <ul className='nav-list'>
                    <li><a href="" className='nav-link'>Perfil</a></li>
                    <li><a href="" className='nav-link'>Minha loja</a></li>
                    <li><a href="" className='nav-link'>Sobre nós</a></li>
                </ul>
            </nav>
            <img src={Carrinho} alt="BALSTORE_carrinho" className='BAL-carrinho'/>
        </>
    )
};

function SellerHeader() {
    return (
        <>
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
        </>
    )
}