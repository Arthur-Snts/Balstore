import "./Footer.css"
import Bal_Logo from "../../assets/BALstore.png"
import Github from "../../assets/github.png"
import "../Cores.css"
import { Link } from "react-router-dom"


export default function Footer (){


    return(
        <>
            <footer>
                <div className="esquerda">
                    <img src={Bal_Logo} alt="Balstore_icon"  className='bal-icon'/>
                    <p>Copyright© 2025 Balstore. All Rights Reserved</p>
                </div>
                <div className="direita">
                    <div className="links">
                        <h5>Links Rápidos</h5>
                        <ul className='footer-list'>
                            <li><Link to="/" className='footer-link'>Página Inicial</Link></li>
                            <li><Link to="/Pesquisa" className='footer-link'>Pesquisa</Link></li>
                            <li><Link to="/Perfil/Compras" className='footer-link'>Perfil</Link></li>
                            <li><Link to="/Perfil/Amizades" className='footer-link'>Lista de Amigos</Link></li>
                            <li><Link to="/Login" className='footer-link'>Venda na Balstore</Link></li>
                            <li><Link to="/Sobre" className='footer-link'>Sobre Nós</Link></li>
                        </ul>
                    </div>
                    <div className="githubs">
                        <img src={Github} alt="Github_icon"  className='git-icon'/>
                        <ul className='footer-list'>
                            <li><a href="https://github.com/Arthur-Snts" className='footer-link'>Arthur Alves</a></li>
                            <li><a href="https://github.com/artur-dantas" className='footer-link'>Artur Dantas</a></li>
                            <li><a href="https://github.com/ElitonJhonys" className='footer-link'>Eliton Johnys</a></li>
                            <li><a href="https://github.com/VictorLuc14" className='footer-link'>Victor Lucas</a></li>
                            <li><a href="https://github.com/Mr-Vitor" className='footer-link'>Vitor Emanuel</a></li>
                        </ul>
                    </div>
                </div>
                

            </footer>
        </>
    )
}