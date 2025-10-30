import "./App.css"
import MainPage from "./pages/MainPage"
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'; 
// O Link importa aonde for o link, aí envolve o que for "linkável, exemplo no Header.jsx e Footer.jsx"
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Sobrenos from "./pages/Sobrenos";


function App() {

  
  return (
    <>
        <Router>
          <Routes>
            <Route path="/" element={<MainPage />}/>
            <Route path="/Login" element={<Login />} /> 
            <Route path="/Cadastro" element={<Cadastro />}/>
            <Route path="/Sobre" element={<Sobrenos/>}/>
            {/*  Adcionando páginas aqui, lembrar de usar UseEffect de título em cada página, exemplo na MainPage */}
          </Routes>
        </Router>
    </>
  );
}
  
export default App;