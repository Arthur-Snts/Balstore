import './Comentario.css'
import { EstrelasAvaliacao } from '../Auxiliares/Icones'

const Comentario = ({ nome, email, avaliacao, dataHora, fotoPerfilUrl, texto }) => {
    const defaultFoto = "https://via.placeholder.com/150/808080/FFFFFF?text=USER";

    return (
        <div className="comentario-container">
            <div className="comentario-cabecalho">
                <img
                    src={fotoPerfilUrl || defaultFoto}
                    alt={`Foto de perfil de ${nome || 'Usuário'}`}
                    className="foto-perfil"
                />

                <div className="info-usuario">
                    <div className="nome-email">
                        <span className="nome-usuario">{nome || 'Usuário Anônimo'}</span>
                        <span className="email-usuario">({email || 'email@nao-informado.com'})</span>
                    </div>

                    <div className="avaliacao-data">
                        <EstrelasAvaliacao rating = {avaliacao || 0} />
                        <span className="data-hora">{dataHora || 'Data não informada'}</span>
                    </div>
                </div>
            </div>

            <div className="comentario-corpo">
                <p className="texto-comentario">{texto || 'Nenhum comentário fornecido.'}</p>
            </div>
        </div>
    );
};

export default Comentario;