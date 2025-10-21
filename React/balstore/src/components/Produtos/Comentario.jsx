import './Comentario.css';


/**
 * Componente de Avaliação de Estrelas (Visual)
 * Exibe a nota numérica ANTES das estrelas.
 * @param {number} rating - O valor da avaliação (ex: 4.5).
 */
const EstrelasAvaliacaoVisual = ({ rating }) => {
// Cria um array de 5 elementos para representar as 5 estrelas
    const estrelas = [...Array(5)].map((_, index) => {
        const valorEstrela = index + 1;
        let classeEstrela = 'estrela-vazia';

        if (valorEstrela - 0.5 <= rating) {
        if (valorEstrela <= rating) {
            classeEstrela = 'estrela-cheia';
        } else {
            classeEstrela = 'estrela-metade';
        }
        }

        return (
        <span key={index} className={`estrela ${classeEstrela}`}>
            {classeEstrela === 'estrela-cheia' && '★'}
            {classeEstrela === 'estrela-metade' && '✫'}
            {classeEstrela === 'estrela-vazia' && '☆'}
        </span>
        );
    });

    return (
        <div className="avaliacao-estrelas-wrapper">
            <span className="nota-numerica">{rating.toFixed(1)}</span> {/* Nota Numérica */}
            <div className="avaliacao-estrelas">{estrelas}</div>
        </div>
    );
    };


export default ComentarioVisual = ({props}) =>{
    

    return (
        <div className="comentario-container">
            <div className="comentario-cabecalho">
                <img
                    src={props.fotoPerfilUrl}
                    alt={`Foto de perfil de ${props.nome}`}
                    className="foto-perfil"
                />

                <div className="info-usuario">
                    <div className="nome-email">
                        <span className="nome-usuario">{props.nome}</span>
                        <span className="email-usuario">({props.email})</span>
                    </div>

                    <div className="avaliacao-data">
                        <EstrelasAvaliacaoVisual rating={props.avaliacao} />
                        <span className="data-hora">{props.dataHora}</span>
                    </div>
                </div>
            </div>

            <div className="comentario-corpo">
                <p className="texto-comentario">{props.texto}</p>
            </div>
        </div>
    );
};

