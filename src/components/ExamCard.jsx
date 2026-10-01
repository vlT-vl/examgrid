import React from "react";
import { HiOutlineArrowPath, HiOutlineClock, HiOutlineLanguage, HiOutlineQuestionMarkCircle } from "react-icons/hi2";
import { useLang } from "../uiText.jsx";

export default function ExamCard({ exam, index = 0, onSelect }) {
  const { t } = useLang();
  const Icon = exam.icon;
  const cardStyle = {
    "--card-delay": `${Math.min(index, 10) * 0.05}s`,
    "--tag-color": exam.categoryStyle.color,
    "--tag-bg": exam.categoryStyle.bg,
  };

  return (
    <button className="exam-card" style={cardStyle} onClick={() => onSelect(exam)} type="button">
      <div className="exam-card-header">
        <span className="exam-card-icon">
          <Icon aria-hidden="true" />
        </span>
        <div className="exam-card-badges">
          <span className="exam-card-tag">{exam.categoryLabel}</span>
          {exam.lastUpdateLabel && (
            <span className="exam-update-pill" title={t("exam.lastUpdatedLabel", { date: exam.lastUpdateLabel })}>
              <HiOutlineArrowPath aria-hidden="true" />
              {exam.lastUpdateLabel}
            </span>
          )}
        </div>
      </div>
      <span className="exam-card-code">{exam.code}</span>
      <span className="exam-card-title">{exam.title}</span>
      <span className="exam-card-desc">{exam.description}</span>
      <div className="exam-card-meta">
        <span className="exam-card-meta-item">
          <HiOutlineClock aria-hidden="true" />
          {exam.duration} min
        </span>
        <span className="exam-card-meta-item">
          <HiOutlineQuestionMarkCircle aria-hidden="true" />
          {exam.questionCount}
        </span>
        {exam.primaryLanguageLabel && (
          <span className="exam-card-meta-item">
            <HiOutlineLanguage aria-hidden="true" />
            {exam.primaryLanguageLabel}
          </span>
        )}
      </div>
    </button>
  );
}
