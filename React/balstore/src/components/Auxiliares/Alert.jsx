import { useEffect, useState } from "react";
import "./Alert.css";

export default function Alert({ tipo = "info", mensagem, onClose }) {
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFade(true); // inicia fade out
      setTimeout(() => onClose && onClose(), 400); // remove depois da animação
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`alert alert-${tipo} ${fade ? "fade-out" : ""}`}>
      {mensagem}
    </div>
  );
}
