// App.js

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Comentario from './components/Produtos/Comentario'; // Assumindo que este é o caminho correto

function App() {

  const dadosComentario = {
    nome: "Ana Beatriz",
    email: "ana.beatriz@exemplo.com",
    avaliacao: 4.2, // A avaliação deve ser um número (0 a 5)
    dataHora: "23/10/2025 às 14:30",
    fotoPerfilUrl: "https://via.placeholder.com/150/00FFFF/808080?text=AB",
    texto: "O componente está perfeito agora! É totalmente reutilizável e exibe as informações dinamicamente via props, mantendo o visual elegante."
  };

  return (
    <div className="App">
      <h1>Exibição Dinâmica do Comentário</h1>
      {/* Passando os dados como props */}
      <Comentario 
        nome={dadosComentario.nome}
        email={dadosComentario.email}
        avaliacao={dadosComentario.avaliacao}
        dataHora={dadosComentario.dataHora}
        fotoPerfilUrl={dadosComentario.fotoPerfilUrl}
        texto={dadosComentario.texto}
      />

      {/* Exemplo de outro uso, mostrando a reutilização */}
      <Comentario 
        nome="Novo Usuário"
        email="novo@email.com"
        avaliacao={1.8}
        dataHora="23/10/2025 às 15:00"
        fotoPerfilUrl="https://via.placeholder.com/150/FF0000/FFFFFF?text=NU"
        texto="Reutilização de componentes é fundamental, e este agora faz isso muito bem!"
      />
    </div>
  );
}

export default App;