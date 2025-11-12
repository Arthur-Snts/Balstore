import Header from "../components/Header_and_Footer/Header"
import Footer from "../components/Header_and_Footer/Footer"
import arthur from "../assets/arthur.png"
import artur from "../assets/artur.png"
import eliton from "../assets/eliton.png"
import victor from "../assets/victor.png"
import vitor from "../assets/vitor.png"
import "./Sobrenos.css"

export default function Sobrenos () {

    const status = "guest"

    return(
        <>
            <Header status={status} active={"Sobre nós"}></Header>
            <div div className="sobrenos">
                <div className="fotos_sobre">
                    <div className="foto_sobre">
                        <img src={arthur} />
                        <p className="text-foto">Arthur Alves</p>
                    </div>
                    <div className="foto_sobre">
                        <img src={artur} />
                        <p className="text-foto">Artur Dantas</p>
                    </div>
                    <div className="foto_sobre">
                        <img src={eliton} />
                        <p className="text-foto">Eliton Johnys</p>
                    </div>
                    <div className="foto_sobre">
                        <img src={victor} />
                        <p className="text-foto">Victor Lucas</p>
                    </div>
                    <div className="foto_sobre">
                        <img src={vitor} />
                        <p className="text-foto">Vitor Emanuel</p>
                    </div>
                    
                </div>
                <h1>Balstore: Desejos que você compartilha, sonhos que viram realidade</h1>
                <p>Bem-vindo à nossa loja virtual!</p>
                <p>Aqui, na Balstore, estamos dedicados a fornecer a você a melhor experiência de compra online possível. Nossa loja age como um centro para compradores e vendedores de todo o Brasil, oferecendo um ambiente fácil de navegar e confiável de comprar.</p>
                <p>Nós valorizamos nossos clientes e nos esforçamos para garantir que você tenha uma experiência de compra satisfatória em nossa loja virtual. Desde o momento em que você navega em nosso site até o momento em que recebe seus produtos, nós estamos comprometidos em tornar sua jornada de compras o mais fácil e agradável possível.</p>            
                <p>Obrigado por escolher a Balstore. Estamos ansiosos para atendê-lo e fornecer a você os melhores produtos e serviços.</p>
            </div>
            <Footer></Footer>
        </>
    )
}