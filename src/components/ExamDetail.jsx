import { useState } from "react";
import {
  HiOutlineArrowLeft,
  HiOutlineArrowPath,
  HiOutlineClock,
  HiOutlineInformationCircle,
  HiOutlineLanguage,
  HiOutlineQuestionMarkCircle,
  HiOutlineUserCircle,
} from "react-icons/hi2";
import VoucherGate from "./VoucherGate.jsx";
import { useLang } from "../uiText.jsx";
import { useVoucher } from "../voucherContext.jsx";

export default function ExamDetail({
  exam,
  candidateName,
  avatarData,
  onBack,
  onStart,
  locked,
  examId,
  canShowAnswers,
  canRandomize,
  canChooseRange,
}) {
  const { t } = useLang();
  const { redeem } = useVoucher();
  const Icon = exam.icon;
  const [avatarFailed, setAvatarFailed] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);
  const [randomize, setRandomize] = useState(false);
  const [rangeFrom, setRangeFrom] = useState(1);
  const [rangeTo, setRangeTo] = useState(exam.questionCount);
  const [voucherCode, setVoucherCode] = useState("");
  const [redeemError, setRedeemError] = useState(null);
  const [redeemBusy, setRedeemBusy] = useState(false);

  const hasOptions = canChooseRange || canRandomize || canShowAnswers;

  const handleStart = () => {
    const from = Math.min(Math.max(1, rangeFrom || 1), exam.questionCount);
    const to = Math.min(Math.max(from, rangeTo || exam.questionCount), exam.questionCount);
    onStart({ showAnswers, randomize, rangeFrom: from, rangeTo: to });
  };

  const submitRedeem = async (e) => {
    e.preventDefault();
    setRedeemBusy(true);
    const result = await redeem(voucherCode, examId);
    setRedeemBusy(false);
    if (result.ok) {
      setVoucherCode("");
      setRedeemError(null);
    } else {
      setRedeemError(result.reason);
    }
  };

  return (
    <div className="exam-detail">
      <button className="exam-detail-back" onClick={onBack} type="button">
        <HiOutlineArrowLeft aria-hidden="true" />
        {t("examDetail.back")}
      </button>

      <div
        className="exam-detail-card"
        style={{ "--tag-color": exam.categoryStyle.color, "--tag-bg": exam.categoryStyle.bg }}
      >
        <span className="exam-detail-icon">
          <Icon aria-hidden="true" />
        </span>
        <span className="exam-detail-tag">{exam.categoryLabel}</span>
        <span className="exam-detail-code">{exam.code}</span>
        <h2 className="exam-detail-title">{exam.title}</h2>
        <p className="exam-detail-desc">{exam.description}</p>

        <div className="exam-detail-stats">
          <div className="exam-detail-stat">
            <HiOutlineClock className="exam-detail-stat-icon" aria-hidden="true" />
            <div className="exam-detail-stat-text">
              <span className="exam-detail-stat-value">{exam.duration} min</span>
              <span className="exam-detail-stat-label">{t("examDetail.duration")}</span>
            </div>
          </div>
          <div className="exam-detail-stat">
            <HiOutlineQuestionMarkCircle className="exam-detail-stat-icon" aria-hidden="true" />
            <div className="exam-detail-stat-text">
              <span className="exam-detail-stat-value">{exam.questionCount}</span>
              <span className="exam-detail-stat-label">{t("examDetail.questions")}</span>
            </div>
          </div>
          {exam.lastUpdateLabel && (
            <div className="exam-detail-stat">
              <HiOutlineArrowPath className="exam-detail-stat-icon" aria-hidden="true" />
              <div className="exam-detail-stat-text">
                <span className="exam-detail-stat-value">{exam.lastUpdateLabel}</span>
                <span className="exam-detail-stat-label">{t("examDetail.lastUpdate")}</span>
              </div>
            </div>
          )}
          {exam.primaryLanguageLabel && (
            <div className="exam-detail-stat">
              <HiOutlineLanguage className="exam-detail-stat-icon" aria-hidden="true" />
              <div className="exam-detail-stat-text">
                <span className="exam-detail-stat-value">{exam.primaryLanguageLabel}</span>
                <span className="exam-detail-stat-label">{t("examDetail.language")}</span>
              </div>
            </div>
          )}
        </div>

        <div className="exam-detail-candidate">
          {avatarData && !avatarFailed ? (
            <img
              className="exam-detail-candidate-avatar"
              src={avatarData}
              alt=""
              onError={() => setAvatarFailed(true)}
            />
          ) : (
            <HiOutlineUserCircle className="exam-detail-candidate-icon" aria-hidden="true" />
          )}
          <strong>{candidateName}</strong>
        </div>

        <div className="exam-detail-below">
          {locked ? (
            <>
              <form className="voucher-block exam-detail-voucher-insert" onSubmit={submitRedeem}>
                <span className="voucher-label">{t("voucher.redeemLabel")}</span>
                <div className="voucher-code">
                  <textarea
                    className="voucher-code-text voucher-code-input"
                    rows={4}
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value)}
                    placeholder={t("voucher.redeemPlaceholder")}
                    aria-label={t("voucher.redeemPlaceholder")}
                    autoComplete="off"
                    spellCheck={false}
                  />
                  <button
                    className="voucher-btn voucher-btn--primary"
                    type="submit"
                    disabled={redeemBusy || !voucherCode.trim()}
                  >
                    {t("voucher.redeem")}
                  </button>
                </div>
                {redeemError && (
                  <p className="voucher-error" role="alert">
                    {t(`voucher.err.${redeemError}`)}
                  </p>
                )}
              </form>
              <VoucherGate fullName={candidateName} examId={examId} />
            </>
          ) : (
            <>
              <p className="exam-start-warning">
                <HiOutlineInformationCircle className="exam-start-warning-icon" aria-hidden="true" />
                {t("examStart.warning")}
              </p>

              {hasOptions && (
                <div className="exam-start-options">
                  {canChooseRange && (
                    <div className="exam-start-option">
                      <span>{t("examStart.range")}</span>
                      <div className="exam-start-range">
                        <input
                          type="number"
                          className="exam-start-range-input"
                          min={1}
                          max={exam.questionCount}
                          value={rangeFrom}
                          onChange={(e) => setRangeFrom(Number(e.target.value))}
                          onWheel={(e) => e.currentTarget.blur()}
                          aria-label={t("examStart.rangeFrom")}
                        />
                        <span className="exam-start-range-sep">–</span>
                        <input
                          type="number"
                          className="exam-start-range-input"
                          min={1}
                          max={exam.questionCount}
                          value={rangeTo}
                          onChange={(e) => setRangeTo(Number(e.target.value))}
                          onWheel={(e) => e.currentTarget.blur()}
                          aria-label={t("examStart.rangeTo")}
                        />
                      </div>
                    </div>
                  )}

                  {canRandomize && (
                    <div className="exam-start-option">
                      <span>{t("examStart.random")}</span>
                      <label className="switch">
                        <input type="checkbox" checked={randomize} onChange={(e) => setRandomize(e.target.checked)} />
                        <span className="slider"></span>
                      </label>
                    </div>
                  )}

                  {canShowAnswers && (
                    <div className="exam-start-option">
                      <span>{t("examStart.showAnswers")}</span>
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={showAnswers}
                          onChange={(e) => setShowAnswers(e.target.checked)}
                        />
                        <span className="slider"></span>
                      </label>
                    </div>
                  )}
                </div>
              )}

              <button className="btn-dark" onClick={handleStart} type="button">
                {t("examDetail.start")}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
