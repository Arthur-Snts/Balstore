import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Header from './components/Header_and_Footer/Header'
import Footer from './components/Header_and_Footer/Footer';
import CarouselBALSTORE from './components/carrossel';
import MainPage from './pages/MainPage'

function App() {


  return (
    <div>
      <MainPage/>
    </div>
  );
}

export default App;