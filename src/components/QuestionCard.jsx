import { useState } from "react";
import { HiOutlineEye, HiOutlineEyeSlash } from "react-icons/hi2";
import { useLang } from "../uiText.jsx";

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export default function QuestionCard({ data, index, selected, onAnswerChange, showAnswers }) {
  const { t } = useLang();
  const [revealed, setRevealed] = useState(false);
  const isSelected = (answer) => selected.includes(answer);
  const isCorrect = (answer) => data.correctAnswers.includes(answer);

  const isSingleAnswer = data.answersnumber === 1;
  const capReached = !isSingleAnswer && selected.length >= data.answersnumber;

  return (
    <div className="question-card">
      <div className="question-card-header">
        <p className="question-text">{data.question}</p>
        {showAnswers && (
          <button
            type="button"
            className={`question-reveal-btn${revealed ? " question-reveal-btn--active" : ""}`}
            onClick={() => setRevealed((prev) => !prev)}
            aria-label={revealed ? t("exam.hideAnswer") : t("exam.revealAnswer")}
            aria-pressed={revealed}
          >
            {revealed ? <HiOutlineEyeSlash aria-hidden="true" /> : <HiOutlineEye aria-hidden="true" />}
          </button>
        )}
      </div>

      <p className="question-select-hint">
        {isSingleAnswer ? t("exam.selectOne") : t("exam.selectMany", { count: data.answersnumber })}
      </p>

      <div className="answers-list">
        {data.answers.map((answer, i) => {
          const checked = isSelected(answer);
          const correct = revealed && isCorrect(answer);
          const disabled = !checked && capReached;
          return (
            <label
              key={i}
              className={`answer-row${checked ? " answer-row--selected" : ""}${correct ? " answer-row--correct" : ""}${disabled ? " answer-row--disabled" : ""}`}
            >
              <input
                className="answer-row-input"
                type={isSingleAnswer ? "radio" : "checkbox"}
                name={isSingleAnswer ? `question-${index}` : undefined}
                checked={checked}
                disabled={disabled}
                onChange={() => onAnswerChange(index, answer)}
              />
              <span className="answer-row-indicator" aria-hidden="true" />
              <span className="answer-row-letter">{LETTERS[i]}</span>
              <span className="answer-row-text">{answer}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
