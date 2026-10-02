import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { HiOutlineExclamationTriangle, HiXMark } from "react-icons/hi2";

export default function ConfirmModal({ title, message, confirmLabel, cancelLabel, onConfirm, onCancel }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onCancel]);

  return createPortal(
    <div className="confirm-overlay" onClick={onCancel}>
      <div className="confirm-card" onClick={(e) => e.stopPropagation()}>
        <div className="confirm-header">
          <HiOutlineExclamationTriangle className="confirm-icon" aria-hidden="true" />
          <h3 className="confirm-title">{title}</h3>
          <button className="confirm-close" onClick={onCancel} aria-label={cancelLabel}>
            <HiXMark aria-hidden="true" />
          </button>
        </div>

        <p className="confirm-message">{message}</p>

        <div className="confirm-actions">
          <button className="confirm-btn confirm-btn--ghost" onClick={onCancel} type="button">
            {cancelLabel}
          </button>
          <button className="confirm-btn confirm-btn--danger" onClick={onConfirm} type="button">
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
