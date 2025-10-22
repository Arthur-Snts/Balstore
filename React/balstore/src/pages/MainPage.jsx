import CategoriaButton from '../components/Produtos/CategoriasButton'
import HeaderGuest from '../components/Header_and_Footer/Header_Guest'
import Footer from '../components/Header_and_Footer/Footer'
import Carrossel from '../components/carrossel'
import ProdutoCard from '../components/Produtos/ProdutoCard'


produto = {}

export default function MainPage() {
    return (
        <>
            <HeaderGuest/>
                <br />
                <Carrossel/>
                <CategoriaButton/>
                <ProdutoCard props={produto}/>
            <Footer/>
        </>

    )
}