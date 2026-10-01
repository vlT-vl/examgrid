import React, { useState } from "react";
import {
  HiOutlineArrowLeft,
  HiOutlineCheckCircle,
  HiOutlineClipboardDocumentCheck,
  HiOutlineDocumentArrowDown,
  HiOutlineXCircle,
} from "react-icons/hi2";
import AnimatedLogo from "./AnimatedLogo.jsx";
import AnswerReview from "./AnswerReview.jsx";
import { useLang } from "../uiText.jsx";

export default function Summary({
  title,
  examCode,
  category,
  icon,
  iconColor,
  candidate,
  avatarUrl,
  score,
  total,
  elapsedTime,
  remainingTime,
  maxScore,
  passingScore,
  questions,
  selectedAnswers,
  canViewAnswerReview,
  onHome,
}) {
  const Icon = icon;
  const { t, lang } = useLang();
  const [avatarFailed, setAvatarFailed] = useState(false);
  const finalScore = Math.round((score / total) * maxScore);
  const passed = finalScore >= passingScore;

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const sec = secs % 60;
    return `${mins} ${t("summary.minutes")}${sec > 0 ? ` ${sec} ${t("summary.seconds")}` : ""}`;
  };

  const now = new Date();
  const nowString = now.toLocaleString(lang === "it" ? "it-IT" : "en-US");
  const fileDate = now.toISOString().slice(0, 16).replace("T", "_").replace(":", "-");
  const safeName = candidate.replace(/[^a-z0-9]/gi, "_");

  const downloadReport = async () => {
    const container = document.querySelector(".summary-container").cloneNode(true);

    const photoImg = container.querySelector(".summary-photo-img");
    if (photoImg && avatarUrl && !avatarFailed) {
      try {
        const res = await fetch(avatarUrl);
        const blob = await res.blob();
        const dataUrl = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
        photoImg.src = dataUrl;
      } catch {}
    }

    const reviewSection = document.querySelector(".review-section");
    const reviewClone = reviewSection ? reviewSection.cloneNode(true) : null;

    let faviconDataUrl = null;
    try {
      const faviconLink = document.querySelector('link[rel="icon"]');
      if (faviconLink) {
        const res = await fetch(faviconLink.href);
        const blob = await res.blob();
        faviconDataUrl = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      }
    } catch {}

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
      <html lang="${lang}" class="${theme}">
      <head>
        <meta charset="UTF-8" />
        ${faviconDataUrl ? `<link rel="icon" type="image/svg+xml" href="${faviconDataUrl}">` : ""}
        <title>${t("summary.reportTitle")}</title>
        <style>
          ${styles}

          html {
            scrollbar-gutter: stable;
          }

          html, body {
            height: 100%;
          }

          body {
            box-sizing: border-box;
            margin: 0;
            padding: 2.5rem 1rem;
            font-family: system-ui, sans-serif;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 1.5rem;
            min-height: 100vh;
            min-height: 100dvh;
            background-color: ${theme === "dark" ? "#1e1e1e" : "#f9f9f9"};
          }
        </style>
      </head>
      <body class="${theme}">
        ${container.outerHTML}
        ${reviewClone ? reviewClone.outerHTML : ""}
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
    <div className="summary-page">
      <button className="exam-detail-back" onClick={onHome} type="button">
        <HiOutlineArrowLeft aria-hidden="true" />
        {t("nav.home")}
      </button>

      <div className="summary-container">
        <div className="summary-header">
          {Icon && (
            <span className="summary-exam-icon" style={{ color: iconColor }}>
              <Icon aria-hidden="true" />
            </span>
          )}
          <span className="summary-eyebrow">{t("summary.reportTitle")}</span>
          <h2 className="summary-title">{title}</h2>
          {examCode && (
            <span className="summary-code-pill" style={{ color: iconColor }}>
              {examCode}
            </span>
          )}
        </div>

        <div className="summary-body">
          <div className="summary-fields">
            <div className="summary-field" style={{ "--field-i": 0 }}>
              <span className="summary-field-label">{t("summary.field.candidate")}</span>
              <span className="summary-field-value">{candidate}</span>
            </div>
            <div className="summary-field" style={{ "--field-i": 1 }}>
              <span className="summary-field-label">{t("summary.field.exam")}</span>
              <span className="summary-field-value">{examCode ? `${examCode} — ${title}` : title}</span>
            </div>
            {category && (
              <div className="summary-field" style={{ "--field-i": 2 }}>
                <span className="summary-field-label">{t("summary.field.category")}</span>
                <span className="summary-field-value">{category}</span>
              </div>
            )}
            <div className="summary-field" style={{ "--field-i": 3 }}>
              <span className="summary-field-label">{t("summary.field.date")}</span>
              <span className="summary-field-value">{nowString}</span>
            </div>
            <div className="summary-field" style={{ "--field-i": 4 }}>
              <span className="summary-field-label">{t("summary.field.correct")}</span>
              <span className="summary-field-value">{t("summary.correctAnswers", { score, total })}</span>
            </div>
            <div className="summary-field" style={{ "--field-i": 5 }}>
              <span className="summary-field-label">{t("summary.field.elapsed")}</span>
              <span className="summary-field-value">{formatTime(elapsedTime)}</span>
            </div>
            <div className="summary-field" style={{ "--field-i": 6 }}>
              <span className="summary-field-label">{t("summary.field.remaining")}</span>
              <span className="summary-field-value">{formatTime(remainingTime)}</span>
            </div>
            <div className="summary-field" style={{ "--field-i": 7 }}>
              <span className="summary-field-label">{t("summary.field.passingScore")}</span>
              <span className="summary-field-value">{passingScore} / {maxScore}</span>
            </div>
            <div className="summary-field summary-field--score" style={{ "--field-i": 8 }}>
              <span className="summary-field-label">{t("summary.field.yourScore")}</span>
              <span className="summary-field-value">{finalScore} / {maxScore}</span>
            </div>
          </div>

          <div className="summary-photo-box">
            {avatarUrl && !avatarFailed ? (
              <img
                className="summary-photo-img"
                src={avatarUrl}
                alt=""
                onError={() => setAvatarFailed(true)}
              />
            ) : (
              <HiOutlineClipboardDocumentCheck className="summary-photo-icon" aria-hidden="true" />
            )}
          </div>
        </div>

        <div className={`summary-grade ${passed ? "result-pass" : "result-fail"}`}>
          <span className="summary-grade-icon">
            {passed ? <HiOutlineCheckCircle aria-hidden="true" /> : <HiOutlineXCircle aria-hidden="true" />}
          </span>
          <span className="summary-grade-text">
            <span className="summary-grade-label">{t("summary.field.grade")}</span>
            <span className="summary-grade-value">{passed ? t("summary.passed") : t("summary.failed")}</span>
          </span>
        </div>

        <p className="summary-disclaimer">{t("summary.disclaimerMain")}</p>
        <p className="summary-disclaimer">{t("summary.disclaimerLegal")}</p>

        <div className="summary-report-brand">
          <AnimatedLogo className="summary-report-logo" />
        </div>
      </div>

      <div className="summary-bottom-actions">
        <button className="summary-download-btn" onClick={downloadReport} type="button">
          <HiOutlineDocumentArrowDown aria-hidden="true" />
          {t("summary.download")}
        </button>
      </div>

      {canViewAnswerReview && questions?.length > 0 && (
        <AnswerReview questions={questions} selectedAnswers={selectedAnswers} />
      )}
    </div>
  );
}
