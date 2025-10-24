import HeaderCliente from '../components/Header_and_Footer/Header_Client';
import Footer from '../components/Header_and_Footer/Footer';
import UserSidebar from '../components/Auxiliares/UserSidebar'

export default function UserProfilePage () {
    const teste = {
        nome_user : "Maria Joaquina",
        num_amigos : 25
    }

    return (
        <>
            <HeaderCliente/>
                <UserSidebar props = {teste}/>
            <Footer/>
        </>

    )
}