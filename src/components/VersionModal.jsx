import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { HiXMark } from "react-icons/hi2";
import { FiInfo } from "react-icons/fi";
import { SiReact, SiVite } from "react-icons/si";
import AnimatedLogo from "./AnimatedLogo.jsx";
import { useLang } from "../uiText.jsx";
import pkgjson from "../../package.json";

const stripCaret = (v) => v?.replace(/^[\^~]/, "") ?? "—";

const STACK = [
  { label: "React", value: stripCaret(pkgjson.dependencies.react) },
  { label: "Vite", value: stripCaret(pkgjson.devDependencies.vite) },
  { label: "React Icons", value: stripCaret(pkgjson.dependencies["react-icons"]) },
];

export default function VersionModal({ onClose }) {
  const { t } = useLang();

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return createPortal(
    <div className="vmo-overlay" onClick={onClose}>
      <div className="vmo-card" onClick={(e) => e.stopPropagation()}>
        <div className="vmo-header">
          <div className="vmo-header-left">
            <FiInfo className="vmo-header-icon" aria-hidden="true" />
            <div>
              <span className="vmo-eyebrow">{t("versionModal.eyebrow")}</span>
              <span className="vmo-subtitle">
                v{pkgjson.version} · {pkgjson.build} · {pkgjson.updated}
              </span>
            </div>
          </div>
          <button className="vmo-close" onClick={onClose} aria-label={t("versionModal.close")}>
            <HiXMark aria-hidden="true" />
          </button>
        </div>

        <div className="vmo-body">
          <div className="vmo-logo-wrap">
            <AnimatedLogo className="al-lg" />
          </div>

          <div className="vmo-grid">
            <div className="vmo-field">
              <span className="vmo-field-label">{t("versionModal.versionLabel")}</span>
              <span className="vmo-field-value">{pkgjson.version}</span>
            </div>
            <div className="vmo-field">
              <span className="vmo-field-label">{t("versionModal.buildLabel")}</span>
              <span className="vmo-field-value">{pkgjson.build}</span>
            </div>
            <div className="vmo-field">
              <span className="vmo-field-label">{t("versionModal.updatedLabel")}</span>
              <span className="vmo-field-value">{pkgjson.updated}</span>
            </div>
          </div>

          <div className="vmo-grid">
            {STACK.map((s) => (
              <div className="vmo-field" key={s.label}>
                <span className="vmo-field-label">{s.label}</span>
                <span className="vmo-field-value">{s.value}</span>
              </div>
            ))}
          </div>

          <p className="vmo-notice">
            {t("versionModal.notice")}
            <br />
            {t("footer.copyright")}. {t("versionModal.rights")}
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
}
