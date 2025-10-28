import Header from '../components/Header_and_Footer/Header';
import Footer from '../components/Header_and_Footer/Footer';
import UserSidebar from '../components/Auxiliares/UserSidebar'

export default function UserProfilePage ({user, active_sidebar, active_header, status}) {
    return (
        <>
            <Header status={status} active={active_header}/>
                <UserSidebar props = {user} active={active_sidebar}/>
            <Footer/>
        </>

    )
}