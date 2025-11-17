import Header from "../components/Header_and_Footer/Header"
import Footer from "../components/Header_and_Footer/Footer"
import editloj from "../assets/editloj.png"
import { useEffect, useState } from "react"


export default function EditarLoja () {

    const status = "lojist"

    const [nome, setNome] = useState("Loja do Amigazão")
    const [descricao, setDescricao] = useState("Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt placeat autem delectus vitae. Quis ipsa facere mollitia, voluptatum sed sapiente voluptatibus consequuntur vel nesciunt? Esse nisi illo aperiam adipisci animi!")
    const [email, setEmail] =  useState("bsjdfhiosdoufsoifasof@gmail.com")
    const [senha, setSenha] = useState("njasfnoisafnioasnvoisbv")
    const [confirmsenha, setConfirmSenha] = useState("")


    const loja = {
        nome: nome,
        descricao: descricao,
        email: email,
        senha: senha
    }


    useEffect(() => {
        document.title = "Editar Loja " + loja.nome;
    }, []);
    
    
    return(
        <>
            <Header status={status} user_name={loja.nome}></Header>
            <div className="login-div">
                <div className="foto editloj">
                    <img src={editloj}/>
                </div>
                <div className="form">
                    <h1>Editar Informações</h1>
                    <div className="formulario">
                        <input type="name" placeholder="Nome..." className="input-name" value={loja.nome} onChange={(e) =>setNome(e.target.value)}/>
                        <input type="email" placeholder="Email..." className="input-email" value={loja.email} onChange={(e) =>setEmail(e.target.value)}/>
                        <textarea placeholder="Descrição..." className="input-name" value={loja.descricao} onChange={(e) =>setDescricao(e.target.value)} style={{maxHeight:"230px"}}></textarea>
                        <input type="password" placeholder="Senha..." className="input-senha" value={loja.senha} onChange={(e) =>setSenha(e.target.value)}/>
                        <input type="password" placeholder="Confirmar Senha..." className="input-senha" value={confirmsenha} onChange={(e) =>setConfirmSenha(e.target.value)}/>
                    </div>
                    <button className="button-entrar">Editar</button>
                </div>
            </div>

            <Footer></Footer>
        </>
    )
}