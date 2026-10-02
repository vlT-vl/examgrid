import React, { useState } from "react";
import {
  HiOutlineUserCircle,
  HiOutlineArrowRightOnRectangle,
  HiOutlineInformationCircle,
  HiOutlineSun,
  HiOutlineMoon,
} from "react-icons/hi2";
import { TbReport } from "react-icons/tb";
import AnimatedLogo from "./AnimatedLogo.jsx";
import LanguageToggle from "./LanguageToggle.jsx";
import { useLang } from "../uiText.jsx";

export default function Navbar({
  username,
  avatarUrl,
  onHome,
  onLogout,
  onInfo,
  onHistory,
  historyCount,
  theme,
  toggleTheme,
}) {
  const { t } = useLang();
  const [avatarFailed, setAvatarFailed] = useState(false);

  return (
    <nav className="navbar">
      <button className="navbar-brand" onClick={onHome} type="button" aria-label={t("nav.home")}>
        <AnimatedLogo />
      </button>

      <div className="navbar-actions">
        <LanguageToggle />

        <button
          className="navbar-icon-btn"
          onClick={toggleTheme}
          type="button"
          aria-label={theme === "dark" ? t("theme.switchToLight") : t("theme.switchToDark")}
          title={theme === "dark" ? t("theme.light") : t("theme.dark")}
        >
          {theme === "dark" ? <HiOutlineSun aria-hidden="true" /> : <HiOutlineMoon aria-hidden="true" />}
        </button>

        <button className="navbar-icon-btn navbar-info-btn" onClick={onInfo} type="button" aria-label={t("nav.info")}>
          <HiOutlineInformationCircle aria-hidden="true" />
        </button>

        <button
          className="navbar-icon-btn navbar-history-btn"
          onClick={onHistory}
          type="button"
          aria-label={t("nav.history")}
          title={t("nav.history")}
        >
          <TbReport aria-hidden="true" />
          {historyCount > 0 && <span className="navbar-history-count">{historyCount > 99 ? "99+" : historyCount}</span>}
        </button>

        <span className="navbar-user">
          {avatarUrl && !avatarFailed ? (
            <img
              className="navbar-avatar"
              src={avatarUrl}
              alt=""
              onError={() => setAvatarFailed(true)}
            />
          ) : (
            <HiOutlineUserCircle aria-hidden="true" />
          )}
          <span className="navbar-username-text">{username}</span>
        </span>

        <button className="navbar-logout" onClick={onLogout} type="button" aria-label={t("nav.logout")}>
          <HiOutlineArrowRightOnRectangle aria-hidden="true" />
          <span className="navbar-logout-text">{t("nav.logout")}</span>
        </button>
      </div>
    </nav>
  );
}
