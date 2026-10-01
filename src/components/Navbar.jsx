import React, { useState } from "react";
import {
  HiOutlineUserCircle,
  HiOutlineArrowRightOnRectangle,
  HiOutlineInformationCircle,
  HiOutlineSun,
  HiOutlineMoon,
} from "react-icons/hi2";
import AnimatedLogo from "./AnimatedLogo.jsx";
import LanguageToggle from "./LanguageToggle.jsx";
import { useLang } from "../uiText.jsx";

export default function Navbar({ username, avatarUrl, onHome, onLogout, onInfo, theme, toggleTheme }) {
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

        <button className="navbar-icon-btn" onClick={onInfo} type="button" aria-label={t("nav.info")}>
          <HiOutlineInformationCircle aria-hidden="true" />
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

        <button className="navbar-logout" onClick={onLogout} type="button">
          <HiOutlineArrowRightOnRectangle aria-hidden="true" />
          {t("nav.logout")}
        </button>
      </div>
    </nav>
  );
}
