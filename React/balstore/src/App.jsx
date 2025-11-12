import "./App.css"
import MainPage from "./pages/MainPage"
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'; 
// O Link importa aonde for o link, aí envolve o que for "linkável, exemplo no Header.jsx e Footer.jsx"
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Sobrenos from "./pages/Sobrenos";
import EditarLoja from "./pages/EditarLoja";
import Pagamento from "./pages/Pagamento";
import Pedidos from "./pages/Pedidos";
import Compras from "./pages/Compras";


function App() {

  
  return (
    <>
        <Router>
          <Routes>
            <Route path="/" element={<MainPage />}/>
            <Route path="/Login" element={<Login />} /> 
            <Route path="/Cadastro" element={<Cadastro />}/>
            <Route path="/Sobre" element={<Sobrenos/>}/>
            <Route path="/Editar Loja" element={<EditarLoja/>}/>
            <Route path="/Pagamento" element={<Pagamento/>}/>
            <Route path="/Pedidos" element={<Pedidos/>}/>
            <Route path="/Minhas Compras" element={<Compras/>}/>
            {/*  Adcionando páginas aqui, lembrar de usar UseEffect de título em cada página, exemplo na MainPage */}
          </Routes>
        </Router>
    </>
  );
}
  
export default App;