import React, { useEffect, useState } from "react";

export default function ElapsedTimer({ onTick }) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => {
        const next = prev + 1;
        if (onTick) onTick(next); // ✅ notifica il padre (App)
        return next;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [onTick]);

  const formatTime = (secs) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="elapsed-timer">
      Tempo trascorso: <strong>{formatTime(elapsedSeconds)}</strong>
    </div>
  );
}
