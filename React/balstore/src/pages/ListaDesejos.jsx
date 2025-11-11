import React from 'react';
// Importa o componente Sidebar
import UserSidebar from '../components/Auxiliares/UserSidebar'; 
// 💡 NOVO: Importa o componente Header
import Header from '../components/Header_and_Footer/Header'; 

// Importa um possível componente de Layout principal, se houver
// import Layout from '../components/Layout/Layout'; 

// Importa o CSS específico para esta página
import './ListaDesejos.css'; 

// Mock de dados do usuário para o exemplo
const userData = {
    nome_user: 'Ana Caroline',
    num_amigos: 42
};

export default function ListaDesejos() {
    // Define o item do menu ativo da Sidebar
    const activeSidebarItem = "Lista de Desejos"; 
    
    // Define o status do usuário para o Header (Cliente logado)
    const userStatus = "client";
    
    // Define o item do menu principal ativo (provavelmente 'Perfil' para páginas de usuário)
    const activeHeaderItem = "Perfil";

    return (
        // Você pode envolver isso em um componente de layout, se aplicável
        // <Layout>
        
        <div className="lista-desejos-page">
            
            {/* 💡 NOVO: Renderiza o Header no topo da página */}
            <Header 
                status={userStatus} 
                active={activeHeaderItem} 
                // Se o status fosse "lojist", user_name também seria necessário.
            />

            <div className="main-content-area">
                
                {/* Renderiza o UserSidebar */}
                <UserSidebar 
                    props={userData} 
                    active={activeSidebarItem} 
                />
                
                <main className="user-profile-content">
                    <h1>Minha Lista de Desejos</h1> 
                    
                    <section>
                        <h2>Itens Salvos ({activeSidebarItem})</h2>
                        <p>Aqui você verá todos os produtos que você salvou na sua lista de desejos.</p>
                        {/* Conteúdo da lista de desejos viria aqui */}
                    </section>
                </main>
            </div>
        </div>
        
        // </Layout>
    );
}