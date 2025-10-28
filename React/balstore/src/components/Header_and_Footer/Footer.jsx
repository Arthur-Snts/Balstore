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
                            <li><a href="" className='footer-link'>Categorias</a></li>
                            <li><a href="" className='footer-link'>Perfil</a></li>
                            <li><a href="" className='footer-link'>Lista de Amigos</a></li>
                            <li><a href="" className='footer-link'>Venda na Balstore</a></li>
                            <li><a href="" className='footer-link'>Sobre Nós</a></li>
                        </ul>
                    </div>
                    <div className="githubs">
                        <img src={Github} alt="Github_icon"  className='git-icon'/>
                        <ul className='footer-list'>
                            <li><a href="" className='footer-link'>Arthur Alves</a></li>
                            <li><a href="" className='footer-link'>Artur Dantas</a></li>
                            <li><a href="" className='footer-link'>Eliton Johnys</a></li>
                            <li><a href="" className='footer-link'>Victor Lucas</a></li>
                            <li><a href="" className='footer-link'>Vitor Emanuel</a></li>
                        </ul>
                    </div>
                </div>
                

            </footer>
        </>
    )
}