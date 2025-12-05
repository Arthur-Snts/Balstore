import avatar from "../../assets/user-icon-default.png"
import "./EditarCliente.css"
import "../Cores.css"
import { useState, useEffect } from "react"
import { putcliente, verificar_token_cliente } from "../../statements"
import { useAlert } from "../Auxiliares/AlertContext";
import Loading from "../../pages/Loading"
import { useNavigate } from "react-router-dom"

export default function EditarCliente (){

    const navigate = useNavigate();
    const [cliente, setCliente] = useState(null)
    const [loading, setLoading] = useState(true)
    const { showAlert } = useAlert();

    useEffect(() => {
            async function carregarUsuario() {
                let token = localStorage.getItem("token");
                if (token){
                    const user_devolvido = await verificar_token_cliente(navigate);
                    
                    setCliente(user_devolvido);
                }
                    else{
                        showAlert(`Você precisa estar conectado como Cliente para acessar essa página` , "info");
                        navigate("/Login") 
                    }
                setLoading(false)
            }
            carregarUsuario();
            
            
        }, []);

    const [senhanova, setSenhaNova] = useState("")
    const [confirmsenhanova, setConfirmSenhaNova] = useState("")

    async function handleEditar (e) {
      e.preventDefault();

      if (senhanova !== confirmsenhanova) {
          showAlert("As Senhas não coincidem!", "erro");
          return;
      }

      const resultado = await putcliente(cliente, senhanova);

      if (resultado.success) {
          showAlert("Conta atualizada com sucesso!", "success");
          setCliente(resultado.cliente);
      } else {
          showAlert(resultado.status, "erro");
      }
  }

    return (
      <> {loading == true ? <Loading/> :
      <div className="perfil-container">
          <div className="avatar">
            <img src={avatar} alt="Avatar" />
          </div>
          <form className="perfil-form">
            <div className="input-container">
                <input 
                  type="text" 
                  id="nome" 
                  name="nome" 
                  placeholder="" 
                  className="input-field" 
                  value={cliente?.nome} 
                  onChange={(e)=>{
                    setCliente(prev => ({
                            ...prev, 
                            nome: e.target.value
                          }));
                  }}
                />
                <label for="nome" className="input-label">Nome</label>
            </div>

            <div className="input-container">
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder=""
                  className="input-field"
                  value={cliente?.email}
                  onChange={(e)=>{
                    setCliente(prev => ({
                            ...prev,
                            email: e.target.value
                        }));
                  }}
                />
                <label for="email" className="input-label">Email</label>
            </div>

            <div className="input-container">
                <input
                  id="senha"
                  type="password"
                  name="senha"
                  placeholder=""
                  className="input-field"
                  onChange={(e)=>{
                    setCliente(prev => ({
                            ...prev,
                            senha: e.target.value
                        }));
                  }}
                />
                <label for="senha" className="input-label">Senha</label>
            </div>
            
            <div className="input-container">
                <input
                  id="senhaNova"
                  type="password"
                  name="senhaNova"
                  placeholder=""
                  className="input-field"
                  value={senhanova}
                  onChange={(e)=>{
                    setSenhaNova(e.target.value)
                  }}
                />
                <label for="senhaNova" className="input-label">Nova senha</label>
            </div>

            <div className="input-container">
                <input
                  id="confirmarSenha"
                  type="password"
                  name="confirmarSenha"
                  placeholder=""
                  className="input-field"
                  value={confirmsenhanova}
                  onChange={(e)=>{
                    setConfirmSenhaNova(e.target.value)
                  }}
                />
                <label for="confirmarSenha" className="input-label">Confirmar nova senha</label>
            </div>
            
            <button className="button-form-atualizar" type="submit" onClick={handleEditar}>Atualizar</button>
          </form>
        </div>}</>
  );

}