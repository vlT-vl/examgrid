import React from "react";

export default function QuestionCard({ data, index, selected, onAnswerChange }) {
  const isSelected = (answer) => selected.includes(answer);

  return (
    <div className="question-card">
      <p className="question-text"><strong>{data.question}</strong></p>
      <ul className="answers-list">
        {data.answers.map((answer, i) => (
          <li key={i} className="answer-item">
            <label className="answer-label">
              <input
                type="checkbox"
                checked={isSelected(answer)}
                onChange={() => onAnswerChange(index, answer)}
              />
              <span>{answer}</span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}