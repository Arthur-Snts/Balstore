import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage'
import Comentario from './components/Produtos/Comentario'

function App() {

  const COMENTARIOS_MOCK = 
    {
        nome: "Maria Oliveira",
        email: "maria.o@visual.com",
        avaliacao: 4.5,
        dataHora: "21/10/2025 às 13:20",
        fotoPerfilUrl: "https://via.placeholder.com/150/FF69B4/FFFFFF?text=MO",
        texto: "O componente ficou ótimo visualmente! Gostei do design moderno e da forma como as estrelas de avaliação foram implementadas. Perfeito para um template."
    }

  return (
    <>
      <Comentario props={COMENTARIOS_MOCK}/>
    </>
  );
}

export default App;