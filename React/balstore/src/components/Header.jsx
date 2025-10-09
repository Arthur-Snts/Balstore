import React from 'react';
import './Header.css'

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
        <div className='container'>
            <img src="" alt="BALSTORE_icon"  className='BAL-icon'/>
            <input type="search" className='search-bar'/>
            <nav>
                <ul className='nav-list'>
                    <li><a href="" className='nav-link active'>Sign up</a></li>
                    <li><a href="" className='nav-link'>Sign in</a></li>
                    <li><a href="" className='nav-link'>Sobre nós</a></li>
                </ul>
            </nav>
            <img src="" alt="BALSTORE_carrinho" className='BAL-carrinho'/>
        </div>
    )
};

function CustomerHeader() {
    return (
        <div className='container'>
        <img src="" alt="BALSTORE_icon" className='BAL-icon'/>
        <input type="search" />
        <nav>
            <ul>
                <li><a href="" className='nav-link'>Perfil</a></li>
                <li><a href="" className='nav-link'>Minha loja</a></li>
                <li><a href="" className='nav-link'>Sobre nós</a></li>
            </ul>
        </nav>
        <img src="" alt="BALSTORE_carrinho" className='BAL-carrinho'/>
        </div>
    )
};

function SellerHeader() {
    return (
        <div className='container'>
        <img src="" alt="BALSTORE_icon" className='BAL-icon'/>
        <nav>
            <ul>
                <li><a href="" className='nav-link'>Meus produtos</a></li>
                <li><a href="" className='nav-link'>Pedidos</a></li>
                <li><a href="" className='nav-link'>Configurações</a></li>
                <li><a href="" className='nav-link'>Sobre nós</a></li>
                <li><a href="" className='nav-link'>Logout</a></li>
            </ul>
        </nav>
        <img src="" alt="BALSTORE_carrinho" className='BAL-carrinho'/>
        </div>
    )
}