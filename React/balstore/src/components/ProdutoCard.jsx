import { Link } from 'react-router-dom';
import './ProdutoCard.css';
import guarana from '../assets/Guarana.png';

export default function ProdutoCard() {
  return (
    <div className='card'>
        <img src={guarana} alt="" className='ProdutoImg'/>
        <div className='informações'>
            <p>Guaraná Antartica</p>
            <p>5,0 *****</p>
            <h3>R$ 70,00</h3>
        </div>
    </div>
  );
}