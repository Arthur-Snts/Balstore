import avatar from "../../assets/user-icon-default.png"
import "./EditarCliente.css"
import "../Cores.css"

export default function EditarCliente ({props}){

    return (
    <div className="perfil-container">
      <div className="avatar">
        <img src={avatar} alt="Avatar" />
      </div>
      <form className="perfil-form">
        <input
          type="text"
          name="nome"
          placeholder="Nome..."
          value={props.nome}
        />
        <input
          type="email"
          name="email"
          placeholder="Email..."
          value={props.email}
        />
        <input
          type="password"
          name="senha"
          placeholder="Senha Antiga"
        />
        <input
          type="password"
          name="senhaNova"
          placeholder="Senha Nova"
        />
        <input
          type="password"
          name="confirmarSenha"
          placeholder="Confirme a Senha Nova"
        />
        <button type="submit">Atualizar</button>
      </form>
    </div>
  );

}