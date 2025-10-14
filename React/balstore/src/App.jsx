import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Header from './components/Header_and_Footer/Header'
import Footer from './components/Header_and_Footer/Footer';
import CarouselBALSTORE from './components/carrossel';

function App() {

  const [userStatus, setUserStatus] = useState("guest");

  return (
    <div>
      <Header status={userStatus} />

      <main style={{ padding: "20px" }}>
        <h2>Página Inicial</h2>
        <p>Status atual: {userStatus}</p>

        {/* Botões para mudar o status e ver o header mudando */}
        <button onClick={() => setUserStatus("guest")}>Deslogar</button>
        <button onClick={() => setUserStatus("customer")}>Logar como Usuário</button>
        <button onClick={() => setUserStatus("seller")}>Logar como Lojista</button>

        <CarouselBALSTORE/>
      </main>

      <Footer></Footer>
    </div>
  );
}

export default App;