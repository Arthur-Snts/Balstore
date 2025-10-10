import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Home from './components/Home';
import About from './components/About';
import Header from './components/Header'
import CarouselBALSTORE from './components/carrossel';
import Navigation from './components/Navigation'; // Seu componente de navegação

function App() {

  const [userStatus, setUserStatus] = useState("guest");

  return (
    <div>
      {/* <BrowserRouter> */}
        {/* <Navigation />  Adiciona a navegação a todas as páginas  para botões*/} 
        {/* <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sobre" element={<About />} />
        </Routes>
      </BrowserRouter> */}
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
    </div>
  );
}

export default App;