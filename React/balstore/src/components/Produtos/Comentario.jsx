// Comentario.jsx

import React from 'react';
import './Comentario.css'; // O CSS permanece o mesmo do passo anterior

/**
 * Componente de Avaliação de Estrelas (com Preenchimento em Barra)
 * @param {number} rating - O valor da avaliação (0 a 5).
 */
const EstrelasBarraProgressoAvaliacao = ({ rating }) => {
  // Converte a avaliação para um número com uma casa decimal e calcula a porcentagem
  const ratingValue = parseFloat(rating);
  const porcentagemPreenchimento = (ratingValue / 5.0) * 100;

  return (
    <div className="avaliacao-estrelas-barra-wrapper">
        <span className="nota-numerica">{ratingValue.toFixed(1)}</span>
        
        <div className="estrelas-container-base" aria-label={`Avaliação de ${ratingValue} de 5`}>
            <div className="estrelas-vazias">
                ★★★★★
            </div>
            <div 
                className="estrelas-preenchidas" 
                style={{ width: `${porcentagemPreenchimento}%` }}
            >
                ★★★★★
            </div>
        </div>
    </div>
  );
};


/**
 * Componente Comentario
 * Recebe todos os dados via props e exibe-os.
 */
const Comentario = ({ nome, email, avaliacao, dataHora, fotoPerfilUrl, texto }) => {
    // Definir uma URL de imagem padrão caso a prop fotoPerfilUrl não seja fornecida
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
                        <EstrelasBarraProgressoAvaliacao rating={avaliacao || 0} />
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