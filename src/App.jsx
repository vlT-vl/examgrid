import React, { useState, useEffect } from "react";
import { SiReact, SiVite, SiNutanix, SiProxmox } from "react-icons/si";
import { FaRedhat } from "react-icons/fa";
import { GrVmware } from "react-icons/gr";
import S2ELogo from "./components/S2ELogo.jsx";
import {
  HiOutlineAcademicCap,
  HiOutlineCpuChip,
  HiOutlineShieldCheck,
  HiOutlineCloud,
  HiOutlineServerStack,
  HiOutlineCommandLine,
  HiOutlineWifi,
  HiOutlineComputerDesktop,
  HiOutlineServer,
  HiOutlineCodeBracket,
  HiOutlineSquares2X2,
  HiXMark,
} from "react-icons/hi2";
import Login from "./components/Login.jsx";
import Navbar from "./components/Navbar.jsx";
import Home from "./components/Home.jsx";
import ExamDetail from "./components/ExamDetail.jsx";
import ExamgridLogo from "./components/ExamgridLogo.jsx";
import VersionModal from "./components/VersionModal.jsx";
import QuestionCard from "./components/QuestionCard.jsx";
import Timer from "./components/Timer.jsx";
import ElapsedTimer from "./components/ElapsedTimer.jsx";
import Summary from "./components/Summary.jsx";
import { useLang } from "./uiText.jsx";
import { useData } from "./dataContext.jsx";
import { useVoucher } from "./voucherContext.jsx";
import pkgjson from "../package.json"
import "./css/styles.css";

const shuffleArray = (arr) => arr.sort(() => Math.random() - 0.5);

const ICON_MAP = {
  "academic-cap": HiOutlineAcademicCap,
  "cpu-chip": HiOutlineCpuChip,
  "shield-check": HiOutlineShieldCheck,
  cloud: HiOutlineCloud,
  "server-stack": HiOutlineServerStack,
  "command-line": HiOutlineCommandLine,
  wifi: HiOutlineWifi,
  "computer-desktop": HiOutlineComputerDesktop,
  server: HiOutlineServer,
  "code-bracket": HiOutlineCodeBracket,
  vmware: GrVmware,
  redhat: FaRedhat,
  nutanix: SiNutanix,
  proxmox: SiProxmox,
  s2e: S2ELogo,
};

const CATEGORY_PALETTE = ["#3fae6a", "#66bb6a", "#2e8b57", "#7fd858", "#4c9a5b", "#57b894"];

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  return hash;
}

function hexToRgba(hex, alpha) {
  const value = hex.replace("#", "");
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function categoryStyle(key, brandColor) {
  const color = brandColor || CATEGORY_PALETTE[hashString(key) % CATEGORY_PALETTE.length];
  return { color, bg: hexToRgba(color, 0.14) };
}

const CATEGORY_LABEL_OVERRIDES = {
  vmware: "VMware",
  s2e: "S2E",
};

function categoryLabel(key) {
  if (CATEGORY_LABEL_OVERRIDES[key]) return CATEGORY_LABEL_OVERRIDES[key];
  return key
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatLastUpdate(dateStr) {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return null;
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}/${date.getFullYear()}`;
}

const PRIMARY_LANGUAGE_LABELS = {
  it: "Italiano",
  en: "English",
  es: "Español",
  fr: "Français",
  de: "Deutsch",
  pt: "Português",
};

function primaryLanguageLabel(code) {
  if (!code) return null;
  const normalized = code.toLowerCase();
  return PRIMARY_LANGUAGE_LABELS[normalized] ?? code.toUpperCase();
}

function decorateExam(exam, lang, categories) {
  return {
    ...exam,
    icon: ICON_MAP[exam.icon] ?? HiOutlineSquares2X2,
    description: exam.description?.[lang] ?? exam.description?.it ?? "",
    categoryStyle: categoryStyle(exam.category, categories?.[exam.category]?.color),
    categoryLabel: categoryLabel(exam.category),
    lastUpdateLabel: formatLastUpdate(exam.lastUpdate),
    primaryLanguageLabel: primaryLanguageLabel(exam.primaryLanguage),
  };
}

const SESSION_KEY = "examgrid-session";

const readStoredUser = () => {
  try {
    return localStorage.getItem(SESSION_KEY) || "";
  } catch {
    return "";
  }
};

export default function App() {
  const { t, lang } = useLang();
  const { catalog, users: usersData, status: dataStatus, error: dataError, loadExam } = useData();
  const voucher = useVoucher();
  const [isLoggedIn, setIsLoggedIn] = useState(() => Boolean(readStoredUser()));
  const [loggedInUser, setLoggedInUser] = useState(readStoredUser);
  const [view, setView] = useState("home");
  const [selectedExam, setSelectedExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [examTitle, setExamTitle] = useState("");
  const [candidateName, setCandidateName] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [correctCount, setCorrectCount] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [remainingTime, setRemainingTime] = useState(120 * 60);
  const [examDuration, setExamDuration] = useState(120);
  const [showError, setShowError] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);
  const [theme, setTheme] = useState("light");
  const [showInfo, setShowInfo] = useState(false);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const handleLogin = (username) => {
    setLoggedInUser(username);
    setIsLoggedIn(true);
    try {
      localStorage.setItem(SESSION_KEY, username);
    } catch {}
  };

  const goHome = () => {
    setView("home");
    setSelectedExam(null);
    setQuestions([]);
    setExamTitle("");
    setCandidateName("");
    setCurrentIndex(0);
    setSelectedAnswers({});
    setCorrectCount(0);
    setElapsedTime(0);
    setRemainingTime(120 * 60);
    setExamDuration(120);
    setShowError(false);
    setShowAnswers(false);
  };

  const cancelExam = () => {
    if (!window.confirm(t("exam.cancelConfirm"))) return;
    setView("detail");
    setQuestions([]);
    setExamTitle("");
    setCurrentIndex(0);
    setSelectedAnswers({});
    setCorrectCount(0);
    setElapsedTime(0);
    setRemainingTime(120 * 60);
    setShowError(false);
    setShowAnswers(false);
  };

  const handleLogout = () => {
    goHome();
    setIsLoggedIn(false);
    setLoggedInUser("");
    try {
      localStorage.removeItem(SESSION_KEY);
    } catch {}
  };

  if (dataStatus === "loading") {
    return <div className="app-loading">{t("app.loading")}</div>;
  }

  if (dataStatus === "error") {
    return <div className="app-loading app-loading--error">{t("app.loadError", { message: dataError })}</div>;
  }

  if (!isLoggedIn) {
    return (
      <Login
        onLogin={handleLogin}
        theme={theme}
        toggleTheme={toggleTheme}
      />
    );
  }

  const handleAnswerChange = (questionIndex, answer) => {
    const q = questions[questionIndex];
    const prevAnswers = selectedAnswers[questionIndex] || [];
    const alreadySelected = prevAnswers.includes(answer);

    let updated;
    if (q.answersnumber === 1) {
      updated = alreadySelected ? prevAnswers : [answer];
    } else if (alreadySelected) {
      updated = prevAnswers.filter((a) => a !== answer);
    } else if (prevAnswers.length < q.answersnumber) {
      updated = [...prevAnswers, answer];
    } else {
      updated = prevAnswers;
    }

    setSelectedAnswers({ ...selectedAnswers, [questionIndex]: updated });
    setShowError(false);
  };

  const isAnswerCountValid = (index) => {
    const userAnswers = selectedAnswers[index] || [];
    return userAnswers.length === questions[index].answersnumber;
  };

  const handleNext = () => {
    if (!isAnswerCountValid(currentIndex)) {
      setShowError(true);
      return;
    }
    setCurrentIndex((prev) => prev + 1);
    setShowError(false);
  };

  const handleBack = () => {
    setCurrentIndex((prev) => prev - 1);
    setShowError(false);
  };

  const finishExam = () => {
    if (!isAnswerCountValid(currentIndex)) {
      setShowError(true);
      return;
    }
    let count = 0;
    questions.forEach((q, i) => {
      const user = selectedAnswers[i] || [];
      if (
        user.length === q.answersnumber &&
        user.every((ans) => q.correctAnswers.includes(ans))
      ) {
        count++;
      }
    });
    setCorrectCount(count);
    setView("summary");
  };

  const loadExamData = async (url, name, contentKey, settings) => {
    try {
      const parsed = await loadExam(url, contentKey);
      const total = parsed.questions.length;
      const from = Math.min(Math.max(1, settings?.rangeFrom ?? 1), total);
      const to = Math.min(Math.max(from, settings?.rangeTo ?? total), total);
      let pool = parsed.questions.slice(from - 1, to).map((q) => ({ ...q }));
      if (settings?.randomize) {
        pool = shuffleArray([...pool]).map((q) => ({
          ...q,
          answers: shuffleArray([...q.answers]),
        }));
      }
      setQuestions(pool);
      setExamTitle(parsed.title);
      setCandidateName(name);
      setExamDuration(parsed.time || 120);
      setRemainingTime((parsed.time || 120) * 60);
      setShowAnswers(Boolean(settings?.showAnswers));
      setView("exam");
    } catch (err) {
      alert(t("exam.loadError", { message: err.message }));
    }
  };

  const currentUser = usersData.users.find((u) => u.username === loggedInUser);
  const displayName = currentUser?.fullName || loggedInUser;
  const decoratedExams = catalog.exams
    .filter((exam) => currentUser?.examAccess === "all" || currentUser?.examAccess?.includes(exam.id))
    .map((exam) => decorateExam(exam, lang, catalog.categories));
  const CATEGORY_ICONS = Object.fromEntries(
    Object.entries(catalog.categories).map(([key, cat]) => [key, ICON_MAP[cat.icon] ?? HiOutlineSquares2X2])
  );
  const CATEGORY_STYLES = Object.fromEntries(
    Object.entries(catalog.categories).map(([key, cat]) => [key, categoryStyle(key, cat.color)])
  );
  const CATEGORY_LABELS = Object.fromEntries(
    Object.keys(catalog.categories).map((key) => [key, categoryLabel(key)])
  );

  return (
    <>
      {view !== "exam" && (
        <Navbar
          username={displayName}
          avatarUrl={currentUser?.avatarUrl}
          onHome={goHome}
          onLogout={handleLogout}
          onInfo={() => setShowInfo(true)}
          theme={theme}
          toggleTheme={toggleTheme}
        />
      )}

      {view === "home" && (
        <Home
          exams={decoratedExams}
          categoryIcons={CATEGORY_ICONS}
          categoryStyles={CATEGORY_STYLES}
          categoryLabels={CATEGORY_LABELS}
          onSelectExam={(exam) => {
            setSelectedExam(exam);
            setView("detail");
          }}
        />
      )}

      {view === "detail" && selectedExam && (
        <ExamDetail
          exam={selectedExam}
          candidateName={displayName}
          onBack={() => setView("home")}
          onStart={(settings) => loadExamData(selectedExam.url, displayName, voucher.record?.key, settings)}
          locked={!voucher.isValidFor(selectedExam.id)}
          examId={selectedExam.id}
          canShowAnswers={Boolean(currentUser?.canRevealAnswers)}
          canRandomize={Boolean(currentUser?.canRandomizeQuestions)}
          canChooseRange={Boolean(currentUser?.canChooseRange)}
        />
      )}

      {view === "exam" && (
        !questions.length ? (
          <div className="loading">{t("exam.loading")}</div>
        ) : (
          <div className="exam-panel">
            <div className="exam-panel-topbar">
              <button className="exam-cancel-btn" onClick={cancelExam} type="button">
                <HiXMark aria-hidden="true" />
                {t("exam.cancel")}
              </button>
              <span className="exam-panel-title">{examTitle}</span>
              <div className="exam-panel-timers">
                <Timer
                  duration={examDuration * 60}
                  onTimeUp={finishExam}
                  onTick={(sec) => setRemainingTime(sec)}
                />
                <ElapsedTimer onTick={(sec) => setElapsedTime(sec)} />
              </div>
            </div>

            <div className="exam-panel-body">
              <p className="exam-panel-progress">
                {t("exam.progress", { current: currentIndex + 1, total: questions.length })}
              </p>
              <QuestionCard
                key={currentIndex}
                data={questions[currentIndex]}
                index={currentIndex}
                selected={selectedAnswers[currentIndex] || []}
                onAnswerChange={handleAnswerChange}
                showAnswers={showAnswers}
              />
              {showError && (
                <div className="error-msg">
                  {t("exam.answerError", { count: questions[currentIndex].answersnumber })}
                </div>
              )}
            </div>

            <div className="exam-panel-bottombar">
              <span className="exam-bottombar-count">
                {currentIndex + 1} / {questions.length}
              </span>
              <div className="exam-bottombar-actions">
                <button className="btn" disabled={currentIndex === 0} onClick={handleBack}>
                  {t("exam.back")}
                </button>
                {currentIndex < questions.length - 1 ? (
                  <button className="btn" onClick={handleNext}>
                    {t("exam.next")}
                  </button>
                ) : (
                  <button className="btn btn-finish" onClick={finishExam}>
                    {t("exam.finish")}
                  </button>
                )}
              </div>
            </div>
          </div>
        )
      )}

      {view === "summary" && (
        <Summary
          title={examTitle}
          examCode={selectedExam?.code}
          category={selectedExam?.categoryLabel}
          icon={selectedExam?.icon}
          iconColor={selectedExam?.categoryStyle?.color}
          candidate={candidateName}
          avatarUrl={currentUser?.avatarUrl}
          score={correctCount}
          total={questions.length}
          elapsedTime={elapsedTime}
          remainingTime={remainingTime}
          maxScore={500}
          passingScore={350}
          questions={questions}
          selectedAnswers={selectedAnswers}
          canViewAnswerReview={Boolean(currentUser?.canReviewQuestions)}
          onHome={goHome}
        />
      )}

      {showInfo && <VersionModal onClose={() => setShowInfo(false)} />}

      {view !== "exam" && (
        <footer className="footer">
          <div className="footer-body">
            <button className="footer-logo-btn" onClick={goHome} type="button" aria-label={t("nav.home")}>
              <ExamgridLogo className="footer-logo" />
            </button>
            <span className="footer-copy">{t("footer.copyright")}</span>
            <button className="footer-version" onClick={() => setShowInfo(true)} type="button">
              v{pkgjson.version} · {pkgjson.build}
            </button>
          </div>

          <div className="footer-bottom">
            <span className="footer-stack">
              {t("footer.builtWith")} <SiReact className="footer-stack-icon" aria-hidden="true" /> React {t("footer.and")}{" "}
              <SiVite className="footer-stack-icon" aria-hidden="true" /> Vite
            </span>
          </div>
        </footer>
      )}
    </>
  );
}
