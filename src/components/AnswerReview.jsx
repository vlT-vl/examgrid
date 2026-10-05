import {
  HiOutlineCheckCircle,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineClipboardDocumentList,
  HiOutlineXCircle,
  HiXMark,
} from "react-icons/hi2";
import { useLang } from "../uiText.jsx";

const TOGGLE_ID = "summary-review-toggle";
const PAGE_SIZE = 20;
const pageRadioId = (n) => `review-page-${n}`;

export default function AnswerReview({ questions, selectedAnswers }) {
  const { t } = useLang();
  const totalPages = Math.max(1, Math.ceil(questions.length / PAGE_SIZE));

  const isCorrect = (q, userAnswers) =>
    userAnswers.length === q.answersnumber && userAnswers.every((a) => q.correctAnswers.includes(a));

  return (
    <div className="review-section">
      <input type="checkbox" id={TOGGLE_ID} className="review-toggle" />
      <label htmlFor={TOGGLE_ID} className="review-pill">
        <HiOutlineClipboardDocumentList className="review-pill-icon" aria-hidden="true" />
        {t("summary.review.pill")}
      </label>

      {Array.from({ length: totalPages }, (_, n) => (
        <input
          key={n}
          type="radio"
          id={pageRadioId(n)}
          name="review-page"
          className="review-page-radio"
          defaultChecked={n === 0}
        />
      ))}

      <div className="review-panel">
        <div className="review-panel-card">
          <div className="review-panel-header">
            <h3 className="review-title">
              <HiOutlineClipboardDocumentList className="review-title-icon" aria-hidden="true" />
              {t("summary.review.title")}
            </h3>
            <label htmlFor={TOGGLE_ID} className="review-panel-dismiss" aria-label={t("voucher.close")}>
              <HiXMark aria-hidden="true" />
            </label>
          </div>

          <div className="review-table-wrap">
            <table className="review-table">
              <thead>
                <tr>
                  <th>{t("summary.review.number")}</th>
                  <th>{t("summary.review.question")}</th>
                  <th>{t("summary.review.yourAnswer")}</th>
                  <th>{t("summary.review.correctAnswer")}</th>
                  <th>{t("summary.review.result")}</th>
                </tr>
              </thead>
              <tbody>
                {questions.map((q, i) => {
                  const userAnswers = selectedAnswers[i] || [];
                  const correct = isCorrect(q, userAnswers);
                  const pageIndex = Math.floor(i / PAGE_SIZE);
                  return (
                    <tr
                      key={i}
                      data-page={pageIndex}
                      className={correct ? "review-row--correct" : "review-row--incorrect"}
                    >
                      <td data-label={t("summary.review.number")}>{i + 1}</td>
                      <td data-label={t("summary.review.question")}>{q.question}</td>
                      <td data-label={t("summary.review.yourAnswer")}>
                        {userAnswers.length ? userAnswers.join(", ") : t("summary.review.noAnswer")}
                      </td>
                      <td data-label={t("summary.review.correctAnswer")}>{q.correctAnswers.join(", ")}</td>
                      <td data-label={t("summary.review.result")}>
                        {correct ? (
                          <span className="review-result review-result--correct">
                            <HiOutlineCheckCircle aria-hidden="true" />
                            {t("summary.review.correct")}
                          </span>
                        ) : (
                          <span className="review-result review-result--incorrect">
                            <HiOutlineXCircle aria-hidden="true" />
                            {t("summary.review.incorrect")}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {Array.from({ length: totalPages }, (_, n) => (
            <div key={n} className="review-pagination" data-page-controls={n}>
              {n > 0 ? (
                <label htmlFor={pageRadioId(n - 1)} className="review-pagination-btn" aria-label={t("summary.review.prevPage")}>
                  <HiOutlineChevronLeft aria-hidden="true" />
                </label>
              ) : (
                <span className="review-pagination-btn review-pagination-btn--disabled" aria-hidden="true">
                  <HiOutlineChevronLeft aria-hidden="true" />
                </span>
              )}
              <span className="review-pagination-label">
                {t("summary.review.pageOf", { page: n + 1, total: totalPages })}
              </span>
              {n < totalPages - 1 ? (
                <label htmlFor={pageRadioId(n + 1)} className="review-pagination-btn" aria-label={t("summary.review.nextPage")}>
                  <HiOutlineChevronRight aria-hidden="true" />
                </label>
              ) : (
                <span className="review-pagination-btn review-pagination-btn--disabled" aria-hidden="true">
                  <HiOutlineChevronRight aria-hidden="true" />
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
