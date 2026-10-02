import React, { useState } from "react";
import { HiOutlineUser, HiOutlineLockClosed, HiOutlineSun, HiOutlineMoon } from "react-icons/hi2";
import AnimatedLogo from "./AnimatedLogo.jsx";
import LanguageToggle from "./LanguageToggle.jsx";
import { useLang } from "../uiText.jsx";
import { useData } from "../dataContext.jsx";

export default function Login({ onLogin, theme, toggleTheme }) {
  const { t } = useLang();
  const { users } = useData();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [shaking, setShaking] = useState(false);

  const triggerShake = () => {
    setShaking(true);
    setTimeout(() => setShaking(false), 450);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setTimeout(() => {
      const trimmedUsername = username.trim();
      const valid = users.users.some(
        (user) => user.username === trimmedUsername && user.password === password
      );
      if (valid) {
        onLogin(trimmedUsername);
      } else {
        setError(t("login.invalidCredentials"));
        triggerShake();
      }
      setLoading(false);
    }, 400);
  };

  return (
    <div className="login-page">
      <LanguageToggle className="login-lang-toggle" />

      <div className={`login-card${shaking ? " is-shaking" : ""}`}>
        <AnimatedLogo className="login-logo al-lg" />
        <h1 className="login-title">{t("login.welcome")}</h1>
        <p className="login-subtitle">{t("login.subtitle")}</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-field" style={{ "--field-i": 0 }}>
            <HiOutlineUser className="login-field-icon" aria-hidden="true" />
            <input
              className="login-input"
              type="text"
              placeholder={t("login.username")}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </div>

          <div className="login-field" style={{ "--field-i": 1 }}>
            <HiOutlineLockClosed className="login-field-icon" aria-hidden="true" />
            <input
              className="login-input"
              type="password"
              placeholder={t("login.password")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <p className="login-error" role="alert">
              {error}
            </p>
          )}

          <button className="login-btn" type="submit" disabled={loading}>
            {loading && <span className="login-btn-spinner" aria-hidden="true" />}
            {loading ? t("login.loading") : t("login.submit")}
          </button>
        </form>

        <button
          className="login-theme-btn"
          onClick={toggleTheme}
          type="button"
          aria-label={theme === "dark" ? t("theme.switchToLight") : t("theme.switchToDark")}
        >
          {theme === "dark" ? <HiOutlineSun aria-hidden="true" /> : <HiOutlineMoon aria-hidden="true" />}
          <span>{theme === "light" ? t("theme.dark") : t("theme.light")}</span>
        </button>
      </div>
    </div>
  );
}
