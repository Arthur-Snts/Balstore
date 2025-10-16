import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header_Lojist from './components/Header_and_Footer/Header_Lojist'
import Header_Guest from './components/Header_and_Footer/Header_Guest'
import Header_Client from './components/Header_and_Footer/Header_Client'



function App() {


  return (
    <div>
      
      <Header_Guest/>
      <Header_Client/>
      <Header_Lojist user_name="Jagunço"/>

    </div>
  );
}

export default App;