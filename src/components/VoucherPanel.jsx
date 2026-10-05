import { useEffect, useState } from "react";
import { HiOutlineCheck, HiOutlineClipboard, HiOutlineLockClosed, HiXMark } from "react-icons/hi2";
import { useVoucher } from "../voucherContext.jsx";
import { useLang } from "../uiText.jsx";

export default function VoucherPanel({ fullName, examId, onClose }) {
  const { t } = useLang();
  const { requestCodeFor, generateRequest } = useVoucher();
  const requestCode = requestCodeFor(examId);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!requestCode) generateRequest(fullName, examId);
  }, [requestCode, fullName, examId, generateRequest]);

  const copyRequest = async () => {
    try {
      await navigator.clipboard.writeText(requestCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="voucher-panel">
      <div className="voucher-panel-header">
        <h2 className="voucher-title">
          <HiOutlineLockClosed className="voucher-title-icon" aria-hidden="true" />
          {t("voucher.title")}
        </h2>
        {onClose && (
          <button type="button" className="voucher-panel-dismiss" onClick={onClose} aria-label={t("voucher.close")}>
            <HiXMark aria-hidden="true" />
          </button>
        )}
      </div>
      <p className="voucher-hint">{t("voucher.intro")}</p>

      <div className="voucher-block">
        <span className="voucher-label">{t("voucher.requestFor", { name: fullName })}</span>
        {requestCode && (
          <div className="voucher-code">
            <code className="voucher-code-text" aria-label={requestCode}>
              {requestCode}
            </code>
            <button className="voucher-copy" type="button" onClick={copyRequest}>
              {copied ? <HiOutlineCheck aria-hidden="true" /> : <HiOutlineClipboard aria-hidden="true" />}
              {copied ? t("voucher.copied") : t("voucher.copy")}
            </button>
          </div>
        )}
        <p className="voucher-hint">{t("voucher.sendToBefore")}</p>
      </div>
    </div>
  );
}
