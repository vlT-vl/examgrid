import React from "react";

export default function Summary({ title, candidate, score, total, elapsedTime, remainingTime, maxScore }) {
  const finalScore = Math.round((score / total) * maxScore);
  const passed = finalScore >= 350;

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const sec = secs % 60;
    return `${mins} minuti${sec > 0 ? ` ${sec} secondi` : ""}`;
  };

  const now = new Date();
  const nowString = now.toLocaleString("it-IT");
  const fileDate = now.toISOString().slice(0, 16).replace("T", "_").replace(":", "-");
  const safeName = candidate.replace(/[^a-z0-9]/gi, "_");

  const downloadReport = () => {
    const container = document.querySelector(".summary-container").cloneNode(true);
    const downloadButton = container.querySelector("button");
    if (downloadButton) container.removeChild(downloadButton);
    const styles = Array.from(document.styleSheets)
      .map((sheet) => {
        try {
          return Array.from(sheet.cssRules || []).map((rule) => rule.cssText).join("\n");
        } catch {
          return "";
        }
      })
      .join("\n");

    const theme = document.body.className || "light";

    const html = `
      <!DOCTYPE html>
      <html lang="it" class="${theme}">
      <head>
        <meta charset="UTF-8" />
        <title>Report Esame</title>
        <style>
          ${styles}

          body {
            margin: 0;
            padding: 0;
            font-family: system-ui, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: ${theme === "dark" ? "#1e1e1e" : "#f9f9f9"};
          }

          .summary-container {
            max-width: 460px;
            width: 90%;
            background: ${theme === "dark" ? "#2c2c2c" : "#fff"};
            color: ${theme === "dark" ? "#eee" : "#111"};
            padding: 40px;
            border-radius: 16px;
            box-shadow: 0 0 30px rgba(0,0,0,0.2);
            text-align: center;
          }

          button {
            display: none;
          }
        </style>
      </head>
      <body class="${theme}">
        ${container.outerHTML}
      </body>
      </html>
    `;

    const blob = new Blob([html], { type: "text/html" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `report-${safeName}-${fileDate}.html`;
    link.click();
  };

  return (
    <div className="summary-container">
      <h2 className="summary-title">{title}</h2>
      <p>{nowString}</p>
      <p><strong>{candidate}</strong></p>
      <p>Risposte corrette: {score} su {total}</p>
      <p><strong>{finalScore} / {maxScore} punti</strong></p>
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
