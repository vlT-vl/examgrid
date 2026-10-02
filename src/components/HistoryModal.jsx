import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  HiOutlineArrowDownTray,
  HiOutlineArrowUpTray,
  HiOutlineExclamationTriangle,
  HiOutlineEye,
  HiXMark,
} from "react-icons/hi2";
import { TbReport } from "react-icons/tb";
import { createHistoryArchive, parseHistoryArchive } from "../lib/examHistory.js";
import { useLang } from "../uiText.jsx";

function HistoryField({ label, children, className = "" }) {
  return (
    <div className={`history-session-field ${className}`}>
      <span className="history-session-label">{label}</span>
      <span className="history-session-value">{children}</span>
    </div>
  );
}

export default function HistoryModal({ entries, username, resolveIcon, onClose, onImport, onOpenReport }) {
  const { t, lang } = useLang();
  const inputRef = useRef(null);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const formatDate = (value) => new Date(value).toLocaleString(lang === "it" ? "it-IT" : "en-US");

  const scoreFor = (entry) => Math.round(
    (entry.result.correctCount / Math.max(entry.result.total, 1)) * entry.result.maxScore
  );

  const formatTime = (seconds) => {
    const safeSeconds = Math.max(0, Math.floor(seconds));
    const hours = Math.floor(safeSeconds / 3600);
    const minutes = Math.floor((safeSeconds % 3600) / 60);
    const secs = safeSeconds % 60;
    return [hours, minutes, secs].map((value) => String(value).padStart(2, "0")).join(":");
  };

  const exportHistory = () => {
    const archive = createHistoryArchive(username, entries);
    const blob = new Blob([JSON.stringify(archive, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const safeUsername = username.replace(/[^a-z0-9_-]/gi, "_");
    link.href = url;
    link.download = `examgrid-history-${safeUsername}-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 0);
  };

  const importHistory = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    try {
      const archive = JSON.parse(await file.text());
      const sessions = parseHistoryArchive(archive, username);
      const result = onImport(sessions);
      setFeedback({
        type: "success",
        text: t("history.importSuccess", { count: result.added, total: result.total }),
      });
    } catch (error) {
      const key = error?.message === "user" ? "history.importWrongUser" : "history.importError";
      setFeedback({ type: "error", text: t(key) });
    }
  };

  return createPortal(
    <div className="history-overlay" onClick={onClose}>
      <div className="history-card" onClick={(event) => event.stopPropagation()}>
        <div className="history-header">
          <div className="history-header-title">
            <TbReport className="history-header-icon" aria-hidden="true" />
            <div>
              <span className="history-eyebrow">{t("history.eyebrow")}</span>
              <h3>{t("history.title")}</h3>
            </div>
          </div>
          <button className="vmo-close" onClick={onClose} type="button" aria-label={t("history.close")}>
            <HiXMark aria-hidden="true" />
          </button>
        </div>

        <div className="history-body">
          <div className="history-warning">
            <HiOutlineExclamationTriangle aria-hidden="true" />
            <span>{t("history.warning")}</span>
          </div>

          <div className="history-actions">
            <button className="history-action-btn" onClick={() => inputRef.current?.click()} type="button">
              <HiOutlineArrowUpTray aria-hidden="true" />
              {t("history.import")}
            </button>
            <input
              ref={inputRef}
              className="history-file-input"
              type="file"
              accept="application/json,.json"
              onChange={importHistory}
            />
            <button
              className="history-action-btn"
              onClick={exportHistory}
              type="button"
              disabled={!entries.length}
            >
              <HiOutlineArrowDownTray aria-hidden="true" />
              {t("history.export")}
            </button>
          </div>

          {feedback && <p className={`history-feedback history-feedback--${feedback.type}`}>{feedback.text}</p>}

          {entries.length ? (
            <div className="history-list">
              {entries.map((entry) => {
                const score = scoreFor(entry);
                const passed = score >= entry.result.passingScore;
                const Icon = resolveIcon(entry.exam.iconKey);
                return (
                  <article
                    key={entry.id}
                    className={`history-session ${passed ? "history-session--passed" : "history-session--failed"}`}
                  >
                    <div className="history-session-grid history-session-grid--identity">
                      <HistoryField label={t("history.icon")} className="history-session-field--icon">
                        <span className="history-vendor-icon" style={{ color: entry.exam.iconColor }}>
                          <Icon aria-hidden="true" />
                        </span>
                      </HistoryField>
                      <HistoryField label={t("history.exam")}>
                        <span className="history-exam-title">{entry.exam.title}</span>
                      </HistoryField>
                      <HistoryField label={t("history.code")}>
                        <span className="history-exam-code" style={{ color: entry.exam.iconColor }}>
                          {entry.exam.code || "—"}
                        </span>
                      </HistoryField>
                      <HistoryField label={t("history.category")}>{entry.exam.categoryLabel || "—"}</HistoryField>
                      <HistoryField label={t("history.candidate")}>{entry.candidate.name}</HistoryField>
                      <HistoryField label={t("history.date")}>{formatDate(entry.completedAt)}</HistoryField>
                    </div>

                    <div className="history-session-grid history-session-grid--metrics">
                      <HistoryField label={t("history.correct")}>
                        {entry.result.correctCount} / {entry.result.total}
                      </HistoryField>
                      <HistoryField label={t("history.elapsed")}>{formatTime(entry.timing.elapsedTime)}</HistoryField>
                      <HistoryField label={t("history.remaining")}>{formatTime(entry.timing.remainingTime)}</HistoryField>
                      <HistoryField label={t("history.passingScore")}>
                        {entry.result.passingScore} / {entry.result.maxScore}
                      </HistoryField>
                      <HistoryField label={t("history.score")}>
                        {score} / {entry.result.maxScore}
                      </HistoryField>
                      <HistoryField label={t("history.result")}>
                        <span className={`review-result ${passed ? "review-result--correct" : "review-result--incorrect"}`}>
                          {passed ? t("summary.passed") : t("summary.failed")}
                        </span>
                      </HistoryField>
                    </div>

                    <div className="history-session-actions">
                      <button
                        className="history-open-btn"
                        onClick={() => onOpenReport(entry)}
                        type="button"
                        aria-label={t("history.openReport", { exam: entry.exam.title })}
                      >
                        <HiOutlineEye aria-hidden="true" />
                        <span>{t("history.open")}</span>
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="history-empty">
              <TbReport aria-hidden="true" />
              <p>{t("history.empty")}</p>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
