import "./Loading.css";

export default function LoadingScreen({ mensagem = "Carregando..." }) {
  return (
    <div className="ls-overlay" role="status" aria-live="polite">
      <div className="ls-card">
        <div className="ls-spinner" aria-hidden="true"></div>
        <div className="ls-text">{mensagem}</div>
      </div>
    </div>
  );
}