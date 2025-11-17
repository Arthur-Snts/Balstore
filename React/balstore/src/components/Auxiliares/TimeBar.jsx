import { useState, useEffect } from "react";
import "./TimeBar.css";

const TimeBar = ({ duration = 180 }) => { // duração em segundos (3 min)
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const progress = (timeLeft / duration) * 100;

  const minutos = Math.floor(timeLeft / 60);
  const segundos = timeLeft % 60;

  return (
    <div className="timer-container">
      <p className="timer-label">Código expira em:</p>
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="timer-text">
        {minutos > 0
          ? `${minutos} minuto${minutos > 1 ? "s" : ""}...`
          : `${segundos} segundo${segundos > 1 ? "s" : ""}...`}
      </p>
    </div>
  );
};

export default TimeBar;