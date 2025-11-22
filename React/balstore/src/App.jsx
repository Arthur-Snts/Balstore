import "./App.css"
import MainPage from "./pages/MainPage"
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'; 
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Pesquisa from "./pages/Pesquisa";
import ConfigCliente from "./pages/ConfigCliente"
import ListaDesejos from "./pages/ListaDesejos";
import Produtos from "./pages/Produtos";
import Sobrenos from "./pages/Sobrenos";
import EditarLoja from "./pages/EditarLoja";
import Pagamento from "./pages/Pagamento";
import Pedidos from "./pages/Pedidos";
import Compras from "./pages/Compras";
import MinhaLoja from "./pages/MinhaLoja";
import Carrinho from "./pages/Carrinho";
import ListaAmigos from "./pages/ListaAmigos";
import ProdutoInd from "./pages/ProdutoInd";
import NotFound from "./pages/NotFound";
import { AlertProvider, useAlert } from "./components/Auxiliares/AlertContext";
import Alert from "./components/Auxiliares/Alert";




function App() {
  
  function AlertWrapper() {
    const { alert } = useAlert();
    return <Alert type={alert?.type} message={alert?.message} />;
  }
  return (
    <>
     <AlertProvider>
      <AlertWrapper />
        <Router>
          <Routes>
            <Route path="/" element={<MainPage />}/> {/*Ta feita */}
             <Route path="/Login" element={<Login />} /> {/*Ta feita */}
            <Route path="/Cadastro" element={<Cadastro />}/> {/*Ta feita */}
            <Route path="/Sobre" element={<Sobrenos/>}/>   {/*Não Precisa */}

            <Route path="/Loja" element={<MinhaLoja/>}/>
            <Route path="/Loja/Editar" element={<EditarLoja/>}/>
            <Route path="/Loja/Produtos" element={<Produtos />}/>
            <Route path="/Loja/Pedidos" element={<Pedidos/>}/>


            <Route path="/Pesquisa" element={<Pesquisa />}/>
            <Route path="/Produto/:id" element={<ProdutoInd/>}/>
            <Route path="/Carrinho" element={<Carrinho/>}/>
            <Route path="/Pagamento" element={<Pagamento/>}/>

            <Route path="/Perfil/Compras" element={<Compras/>}/>
            <Route path="/Perfil/Config" element={<ConfigCliente />}/> {/*Ta feita */}
            <Route path="/Perfil/Favoritos" element={<ListaDesejos/>}/> {/*Ta feita */}
            <Route path="/Perfil/Amizades" element={<ListaAmigos/>}/>

            <Route path="*" element={<NotFound/>}/>
          </Routes>
        </Router>
      </AlertProvider>
    </>
  );
}
  
export default App;