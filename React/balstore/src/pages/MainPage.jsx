import CategoriaButton from '../components/Produtos/CategoriasButton'
import CarrosselCategoria from '../components/Produtos/CarrosselCategoria'
import HeaderGuest from '../components/Header_and_Footer/Header_Guest'
import Footer from '../components/Header_and_Footer/Footer'
import Carrossel from '../components/carrossel'


export default function MainPage() {
    return (
        <>
            <HeaderGuest/>
                <Carrossel/>
                <CategoriaButton/>
                <CarrosselCategoria/>
            <Footer/>
        </>

    )
}