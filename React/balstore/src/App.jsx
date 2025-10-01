import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import About from './components/About';
import Navigation from './components/Navigation'; // Seu componente de navegação

function App() {
  return (
    <BrowserRouter>
      {/* <Navigation />  Adiciona a navegação a todas as páginas  para botões*/} 
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sobre" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;