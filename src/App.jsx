import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import { SiNutanix, SiProxmox } from "react-icons/si";
import { FaRedhat } from "react-icons/fa";
import { GrVmware } from "react-icons/gr";
import { RiCloseCircleLine } from "react-icons/ri";
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
} from "react-icons/hi2";
import Login from "./components/Login.jsx";
import SplashScreen from "./components/SplashScreen.jsx";
import Navbar from "./components/Navbar.jsx";
import Home from "./components/Home.jsx";
import ExamDetail from "./components/ExamDetail.jsx";
import ExamgridLogo from "./components/ExamgridLogo.jsx";
import VersionModal from "./components/VersionModal.jsx";
import ConfirmModal from "./components/ConfirmModal.jsx";
import HistoryModal from "./components/HistoryModal.jsx";
import QuestionCard from "./components/QuestionCard.jsx";
import Timer from "./components/Timer.jsx";
import ElapsedTimer from "./components/ElapsedTimer.jsx";
import Summary from "./components/Summary.jsx";
import { useLang } from "./uiText.jsx";
import { useData } from "./dataContext.jsx";
import { useVoucher } from "./voucherContext.jsx";
import {
  createHistoryId,
  mergeExamHistory,
  readExamHistory,
  readSeenHistoryIds,
  writeExamHistory,
  writeSeenHistoryIds,
} from "./lib/examHistory.js";
import { readExamProgress, writeExamProgress, clearExamProgress } from "./lib/examProgress.js";
import pkgjson from "../package.json"
import "./css/styles.css";

const shuffleArray = (arr) => arr.sort(() => Math.random() - 0.5);

function computeScore(questions, selectedAnswers) {
  let count = 0;
  questions.forEach((q, i) => {
    const user = selectedAnswers[i] || [];
    if (user.length === q.answersnumber && user.every((ans) => q.correctAnswers.includes(ans))) {
      count++;
    }
  });
  return count;
}

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
    iconKey: exam.icon,
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

const getPreferredTheme = () => {
  try {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  } catch {
    return "light";
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
  const [showAnswers, setShowAnswers] = useState(false);
  const [theme, setTheme] = useState(getPreferredTheme);
  const [showInfo, setShowInfo] = useState(false);
  const [showEndExamConfirm, setShowEndExamConfirm] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [historyEntries, setHistoryEntries] = useState([]);
  const [unreadHistoryCount, setUnreadHistoryCount] = useState(0);
  const [reportCompletedAt, setReportCompletedAt] = useState(null);
  const [reportAvatarData, setReportAvatarData] = useState("");
  const [splashMinDelayDone, setSplashMinDelayDone] = useState(false);
  const [splashExiting, setSplashExiting] = useState(false);
  const [splashGone, setSplashGone] = useState(false);
  const splashExitTriggered = useRef(false);
  const progressRestoreAttempted = useRef(false);
  const currentUser = usersData?.users?.find((user) => user.username === loggedInUser);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  useLayoutEffect(() => {
    document.body.className = `${theme}${view === "home" ? " home-active" : ""}`;
  }, [theme, view]);

  useEffect(() => {
    const timer = setTimeout(() => setSplashMinDelayDone(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const entries = readExamHistory(loggedInUser);
    const seenIds = new Set(readSeenHistoryIds(loggedInUser));
    setHistoryEntries(entries);
    setUnreadHistoryCount(entries.filter((entry) => !seenIds.has(entry.id)).length);
  }, [loggedInUser]);

  useEffect(() => {
    if (progressRestoreAttempted.current) return;
    if (!loggedInUser || dataStatus !== "ready") return;
    progressRestoreAttempted.current = true;
    const saved = readExamProgress(loggedInUser);
    if (!saved) return;
    const rawExam = catalog.exams.find((exam) => exam.id === saved.examId);
    if (!rawExam) {
      clearExamProgress(loggedInUser);
      return;
    }
    setSelectedExam(decorateExam(rawExam, lang, catalog.categories));
    setQuestions(saved.questions);
    setExamTitle(saved.examTitle);
    setCandidateName(saved.candidateName);
    setCurrentIndex(saved.currentIndex);
    setSelectedAnswers(saved.selectedAnswers);
    setExamDuration(saved.examDuration);
    setRemainingTime(saved.remainingTime);
    setElapsedTime(saved.elapsedTime);
    setShowAnswers(saved.showAnswers);
    setView("exam");
  }, [loggedInUser, dataStatus, catalog, lang]);

  useEffect(() => {
    if (view !== "exam" || !loggedInUser || !selectedExam) return;
    writeExamProgress(loggedInUser, {
      examId: selectedExam.id,
      examTitle,
      candidateName,
      currentIndex,
      selectedAnswers,
      questions,
      examDuration,
      remainingTime,
      elapsedTime,
      showAnswers,
    });
  }, [
    view,
    loggedInUser,
    selectedExam,
    examTitle,
    candidateName,
    currentIndex,
    selectedAnswers,
    questions,
    examDuration,
    remainingTime,
    elapsedTime,
    showAnswers,
  ]);

  useEffect(() => {
    if (view !== "exam") return;
    const handler = (event) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [view]);

  const splashReadyToExit = dataStatus !== "loading" && splashMinDelayDone;

  useEffect(() => {
    if (!splashReadyToExit || splashExitTriggered.current) return;
    splashExitTriggered.current = true;
    setSplashExiting(true);
    const timer = setTimeout(() => setSplashGone(true), 400);
    return () => clearTimeout(timer);
  }, [splashReadyToExit]);

  const handleLogin = (username) => {
    const entries = readExamHistory(username);
    const seenIds = new Set(readSeenHistoryIds(username));
    setLoggedInUser(username);
    setHistoryEntries(entries);
    setUnreadHistoryCount(entries.filter((entry) => !seenIds.has(entry.id)).length);
    setIsLoggedIn(true);
    try {
      localStorage.setItem(SESSION_KEY, username);
    } catch {}
  };

  const goHome = () => {
    clearExamProgress(loggedInUser);
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
    setShowAnswers(false);
    setReportCompletedAt(null);
    setReportAvatarData("");
  };

  const endExam = ({ finalRemainingTime = remainingTime } = {}) => {
    const score = computeScore(questions, selectedAnswers);
    const completedAt = new Date().toISOString();
    const entry = {
      id: createHistoryId(),
      completedAt,
      exam: {
        id: selectedExam?.id ?? "",
        code: selectedExam?.code ?? "",
        title: examTitle,
        category: selectedExam?.category ?? "",
        categoryLabel: selectedExam?.categoryLabel ?? "",
        iconKey: selectedExam?.iconKey ?? selectedExam?.category ?? "",
        iconColor: selectedExam?.categoryStyle?.color ?? "#66bb6a",
      },
      candidate: {
        name: candidateName,
        avatarData: currentUser?.avatarData ?? "",
      },
      result: {
        correctCount: score,
        total: questions.length,
        maxScore: 500,
        passingScore: 350,
      },
      timing: {
        elapsedTime,
        remainingTime: finalRemainingTime,
        durationMinutes: examDuration,
      },
      questions: JSON.parse(JSON.stringify(questions)),
      selectedAnswers: JSON.parse(JSON.stringify(selectedAnswers)),
    };

    setCorrectCount(score);
    setReportCompletedAt(completedAt);
    setReportAvatarData(currentUser?.avatarData ?? "");
    setHistoryEntries((current) => {
      const next = mergeExamHistory(current, [entry]);
      try {
        writeExamHistory(loggedInUser, next);
      } catch {}
      return next;
    });
    setUnreadHistoryCount((count) => count + 1);
    clearExamProgress(loggedInUser);
    setView("summary");
  };

  const endExamNow = () => {
    setShowEndExamConfirm(true);
  };

  const confirmEndExam = () => {
    setShowEndExamConfirm(false);
    endExam();
  };

  const handleTimeUp = () => {
    setRemainingTime(0);
    endExam({ finalRemainingTime: 0 });
  };

  const handleLogout = () => {
    goHome();
    setShowHistory(false);
    setHistoryEntries([]);
    setUnreadHistoryCount(0);
    setIsLoggedIn(false);
    setLoggedInUser("");
    try {
      localStorage.removeItem(SESSION_KEY);
    } catch {}
  };

  if (dataStatus === "error") {
    return <div className="app-loading app-loading--error">{t("app.loadError", { message: dataError })}</div>;
  }

  if (!splashGone) {
    return <SplashScreen exiting={splashExiting} />;
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
  };

  const isAnswerCountValid = (index) => {
    const userAnswers = selectedAnswers[index] || [];
    return userAnswers.length === questions[index].answersnumber;
  };

  const handleNext = () => {
    setCurrentIndex((prev) => prev + 1);
  };

  const handleBack = () => {
    setCurrentIndex((prev) => prev - 1);
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
      setCurrentIndex(0);
      setSelectedAnswers({});
      setExamDuration(parsed.time || 120);
      setRemainingTime((parsed.time || 120) * 60);
      setElapsedTime(0);
      setShowAnswers(Boolean(settings?.showAnswers));
      setReportCompletedAt(null);
      setReportAvatarData(currentUser?.avatarData ?? "");
      setView("exam");
    } catch (err) {
      alert(t("exam.loadError", { message: err.message }));
    }
  };

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

  const importHistory = (importedEntries) => {
    const merged = mergeExamHistory(historyEntries, importedEntries);
    const added = merged.length - historyEntries.length;
    writeExamHistory(loggedInUser, merged);
    try {
      writeSeenHistoryIds(loggedInUser, merged.map((entry) => entry.id));
    } catch {}
    setHistoryEntries(merged);
    setUnreadHistoryCount(0);
    return { added, total: merged.length };
  };

  const openHistory = () => {
    try {
      writeSeenHistoryIds(loggedInUser, historyEntries.map((entry) => entry.id));
    } catch {}
    setUnreadHistoryCount(0);
    setShowHistory(true);
  };

  const openHistoryReport = (entry) => {
    setSelectedExam({
      id: entry.exam.id,
      code: entry.exam.code,
      category: entry.exam.category,
      categoryLabel: entry.exam.categoryLabel,
      categoryStyle: { color: entry.exam.iconColor },
      iconKey: entry.exam.iconKey,
      icon: ICON_MAP[entry.exam.iconKey] ?? HiOutlineSquares2X2,
    });
    setQuestions(entry.questions);
    setExamTitle(entry.exam.title);
    setCandidateName(entry.candidate.name);
    setSelectedAnswers(entry.selectedAnswers);
    setCorrectCount(entry.result.correctCount);
    setElapsedTime(entry.timing.elapsedTime);
    setRemainingTime(entry.timing.remainingTime);
    setExamDuration(entry.timing.durationMinutes || 120);
    setReportCompletedAt(entry.completedAt);
    setReportAvatarData(entry.candidate.avatarData || "");
    setShowHistory(false);
    setView("summary");
  };

  return (
    <>
      {view !== "exam" && (
        <Navbar
          username={displayName}
          avatarData={currentUser?.avatarData}
          onHome={goHome}
          onLogout={handleLogout}
          onInfo={() => setShowInfo(true)}
          onHistory={openHistory}
          historyCount={unreadHistoryCount}
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
          avatarData={currentUser?.avatarData}
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
              <button className="exam-cancel-btn" onClick={endExamNow} type="button">
                <RiCloseCircleLine aria-hidden="true" />
                {t("exam.cancel")}
              </button>
              <div className="exam-panel-identity">
                {selectedExam?.icon && (
                  <span className="exam-panel-icon" style={{ color: selectedExam.categoryStyle?.color }}>
                    <selectedExam.icon aria-hidden="true" />
                  </span>
                )}
                <span className="exam-panel-title">{examTitle}</span>
                {selectedExam?.code && (
                  <span className="exam-panel-code-pill" style={{ color: selectedExam.categoryStyle?.color }}>
                    {selectedExam.code}
                  </span>
                )}
              </div>
              <div className="exam-panel-timers">
                <Timer
                  duration={remainingTime}
                  onTimeUp={handleTimeUp}
                  onTick={(sec) => setRemainingTime(sec)}
                />
                <ElapsedTimer initialSeconds={elapsedTime} onTick={(sec) => setElapsedTime(sec)} />
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
                  <button className="btn" disabled={!isAnswerCountValid(currentIndex)} onClick={handleNext}>
                    {t("exam.next")}
                  </button>
                ) : (
                  <button className="btn btn-finish" disabled={!isAnswerCountValid(currentIndex)} onClick={() => endExam()}>
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
          avatarData={reportAvatarData || currentUser?.avatarData}
          score={correctCount}
          total={questions.length}
          elapsedTime={elapsedTime}
          remainingTime={remainingTime}
          maxScore={500}
          passingScore={350}
          questions={questions}
          selectedAnswers={selectedAnswers}
          canViewAnswerReview={Boolean(currentUser?.canReviewQuestions)}
          completedAt={reportCompletedAt}
          onHome={goHome}
        />
      )}

      {showInfo && <VersionModal onClose={() => setShowInfo(false)} />}

      {showHistory && (
        <HistoryModal
          entries={historyEntries}
          username={loggedInUser}
          resolveIcon={(iconKey) => ICON_MAP[iconKey] ?? HiOutlineSquares2X2}
          onClose={() => setShowHistory(false)}
          onImport={importHistory}
          onOpenReport={openHistoryReport}
        />
      )}

      {showEndExamConfirm && (
        <ConfirmModal
          title={t("exam.cancelTitle")}
          message={t("exam.cancelConfirm")}
          confirmLabel={t("exam.cancelConfirmBtn")}
          cancelLabel={t("exam.cancelDismissBtn")}
          onConfirm={confirmEndExam}
          onCancel={() => setShowEndExamConfirm(false)}
        />
      )}

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
        </footer>
      )}
    </>
  );
}
