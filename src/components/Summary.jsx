import React from "react";

export default function Summary({ title, candidate, score, total, elapsedTime, remainingTime, maxScore }) {
  const finalScore = Math.round((score / total) * maxScore);
  const passed = finalScore >= 350;

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const sec = secs % 60;
    return `${mins} minuti ${sec > 0 ? sec + ' secondi' : ''}`;
  };

  const now = new Date();
  const nowString = now.toLocaleString("it-IT");
  const fileDate = now.toISOString().slice(0, 16).replace("T", "_").replace(":", "-");

  const safeName = candidate.replace(/[^a-z0-9]/gi, '_');

  const downloadReport = () => {
    const htmlContent = `
      <html>
      <head>
        <meta charset="UTF-8" />
        <title>Report Esame</title>
        <style>
          body {
            background-color: #1e232c;
            font-family: Arial, sans-serif;
            color: #333;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
          }
          .report-box {
            background-color: #fff;
            border-radius: 10px;
            padding: 40px;
            text-align: center;
            box-shadow: 0 0 20px rgba(0,0,0,0.2);
            width: 450px;
          }
          .report-box h1 {
            font-size: 24px;
            margin-bottom: 10px;
          }
          .report-box p {
            margin: 6px 0;
            font-size: 16px;
          }
          .status {
            margin-top: 20px;
            font-size: 24px;
            font-weight: bold;
            color: ${passed ? '#28a745' : '#e60000'};
          }
        </style>
      </head>
      <body>
        <div class="report-box">
          <h1>${title}</h1>
          <p><strong>Risultato Quiz</strong></p>
          <p>${nowString}</p>
          <p>Candidato: ${candidate}</p>
          <p>Punteggio: <strong>${finalScore} / ${maxScore}</strong></p>
          <p>Domande Completate: ${total} / ${total}</p>
          <p>Risposte Corrette: ${score} / ${total}</p>
          <p>Tempo Totale Impiegato: ${formatTime(elapsedTime)}</p>
          <p>Tempo Rimanente: ${formatTime(remainingTime)}</p>
          <div class="status">${passed ? 'PROMOSSO' : 'BOCCIATO'}</div>
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: "text/html" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `report-${safeName}-${fileDate}.html`;
    link.click();
  };

  return (
    <div className="summary-container">
      <h2 className="summary-title">{title}</h2>
      <p className="summary-score">Risposte corrette: {score} su {total}</p>
      <p>Punteggio ottenuto: <strong>{finalScore} / {maxScore}</strong></p>
      <p>Tempo trascorso: {formatTime(elapsedTime)}</p>
      <p>Tempo rimanente: {formatTime(remainingTime)}</p>
      <div className={passed ? "result-pass" : "result-fail"}>
        {passed ? "✅ Promosso" : "❌ Bocciato"}
      </div>
      <button className="btn mt-4" onClick={downloadReport}>
        Scarica Report HTML
      </button>
    </div>
  );
}
