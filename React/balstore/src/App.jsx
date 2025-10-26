import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Endereco from './components/Cliente/Endereco';


function App() {

  const enderecos = [
  {
    id: 1,
    rua: "Av. Paulista",
    numero: "1578",
    bairro: "Bela Vista",
    cidade: "São Paulo",
    estado: "SP",
    CEP: "01310-200"
  },
  {
    id: 2,
    rua: "Rua das Flores",
    numero: "245",
    bairro: "Jardim das Rosas",
    cidade: "Rio de Janeiro",
    estado: "RJ",
    CEP: "22041-030"
  },
  {
    id: 3,
    rua: "Av. Brasil",
    numero: "1020",
    bairro: "Centro",
    cidade: "Belo Horizonte",
    estado: "MG",
    CEP: "30190-002"
  },
  {
    id: 4,
    rua: "Rua Padre Cícero",
    numero: "78",
    bairro: "Centro",
    cidade: "Fortaleza",
    estado: "CE",
    CEP: "60025-000"
  },
  {
    id: 5,
    rua: "Av. Sete de Setembro",
    numero: "500",
    bairro: "Centro",
    cidade: "Curitiba",
    estado: "PR",
    CEP: "80020-310"
  },
  {
    id: 6,
    rua: "Rua XV de Novembro",
    numero: "1234",
    bairro: "Centro",
    cidade: "Florianópolis",
    estado: "SC",
    CEP: "88010-001"
  },
  {
    id: 7,
    rua: "Av. Dom Pedro II",
    numero: "890",
    bairro: "Centro",
    cidade: "Salvador",
    estado: "BA",
    CEP: "40020-210"
  },
  {
    id: 8,
    rua: "Rua das Acácias",
    numero: "32",
    bairro: "Jardim América",
    cidade: "Campinas",
    estado: "SP",
    CEP: "13083-260"
  },
  {
    id: 9,
    rua: "Rua Monteiro Lobato",
    numero: "215",
    bairro: "Centro",
    cidade: "Porto Alegre",
    estado: "RS",
    CEP: "90020-040"
  },
  {
    id: 10,
    rua: "Av. Santos Dumont",
    numero: "400",
    bairro: "Centro",
    cidade: "Goiânia",
    estado: "GO",
    CEP: "74010-010"
  }
];


  return (
    <>
      <Endereco enderecos={enderecos}></Endereco>
    </>
  );
}
  
export default App;