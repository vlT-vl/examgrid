import React, { useEffect, useState } from "react";

export default function Timer({ duration, onTimeUp }) {
  const [secondsLeft, setSecondsLeft] = useState(duration);

  useEffect(() => {
    if (secondsLeft <= 0) {
      onTimeUp();
      return;
    }
    const timer = setTimeout(() => setSecondsLeft(secondsLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft, onTimeUp]);

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const sec = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  return (
    <div className="timer">
      <span className="timer-label">Tempo rimanente:</span>
      <span className="timer-value">{formatTime(secondsLeft)}</span>
    </div>
  );
}