import React, { useState, useEffect } from "react";
import jsonparse from "../module/jsonparse.js";
import QuestionCard from "./components/QuestionCard.jsx";
import Timer from "./components/Timer.jsx";
import ElapsedTimer from "./components/ElapsedTimer.jsx";
import Summary from "./components/Summary.jsx";
import pkgjson from "../package.json"
import "./styles.css";

const shuffleArray = (arr) => arr.sort(() => Math.random() - 0.5);

export default function App() {
  const [questions, setQuestions] = useState([]);
  const [examTitle, setExamTitle] = useState("");
  const [candidateName, setCandidateName] = useState("");
  const [inputName, setInputName] = useState("");
  const [jsonToken, setJsonToken] = useState("");
  const [examsList, setExamsList] = useState([]);
  const [selectedExamUrl, setSelectedExamUrl] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isExamFinished, setIsExamFinished] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [remainingTime, setRemainingTime] = useState(120 * 60);
  const [examDuration, setExamDuration] = useState(120); // default fallback
  const [showError, setShowError] = useState(false);
  const [theme, setTheme] = useState("light");
  const [showInfo, setShowInfo] = useState(false);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  useEffect(() => {
    fetch("https://raw.githubusercontent.com/vlT-vl/examgrid/refs/heads/exam/.index.json")
      .then(res => res.json())
      .then(setExamsList)
      .catch(err => console.error("Errore caricamento exams list:", err));
  }, []);

  const handleAnswerChange = (questionIndex, answer) => {
    const prevAnswers = selectedAnswers[questionIndex] || [];
    const updated = prevAnswers.includes(answer)
      ? prevAnswers.filter((a) => a !== answer)
      : [...prevAnswers, answer];
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
    setIsExamFinished(true);
  };

  const loadEncryptedJson = async () => {
    try {
      const parsed = await jsonparse(selectedExamUrl, jsonToken);
      const randomized = shuffleArray([...parsed.questions])
        .slice(0, 70)
        .map((q) => ({
          ...q,
          answers: shuffleArray([...q.answers]),
        }));
      setQuestions(randomized);
      setExamTitle(parsed.title);
      setCandidateName(inputName.trim());
      setExamDuration(parsed.time || 120); // <-- usa tempo dal file, fallback 120
      setRemainingTime((parsed.time || 120) * 60);
    } catch (err) {
      alert(`Errore caricamento quiz: ${err.message}`);
    }
  };

  return (
    <>
      <header className="header">
        <h1 className="header-title">examgrid</h1>
      </header>

      {!candidateName ? (
        <div className={`start-screen ${theme}`}>
          <div className="start-box">
            <h2 className="start-title">Importa Esame</h2>
            <input
              className="input-field"
              type="text"
              placeholder="Nome candidato"
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
            />

            <select
              className="input-field"
              value={selectedExamUrl}
              onChange={(e) => setSelectedExamUrl(e.target.value)}
            >
              <option value="">Seleziona un esame</option>
              {examsList.map((exam, i) => (
                <option key={i} value={exam.url}>
                  {exam.label}
                </option>
              ))}
            </select>

            <input
              className="input-field"
              type="password"
              placeholder="Token di accesso"
              value={jsonToken}
              onChange={(e) => setJsonToken(e.target.value)}
            />

            <button className="btn-dark" onClick={loadEncryptedJson} disabled={!selectedExamUrl}>
              Carica e Avvia Esame
            </button>

            <button className="btn-info" onClick={() => setShowInfo(true)}>
              info
            </button>

            <div className="theme-toggle">
              <label className="switch">
                <input type="checkbox" onChange={toggleTheme} />
                <span className="slider"></span>
              </label>
              <span className="theme-label">
                {theme === "light" ? "Tema Chiaro" : "Tema Scuro"}
              </span>
            </div>
          </div>
        </div>
      ) : !questions.length ? (
        <div className="loading">Caricamento domande...</div>
      ) : isExamFinished ? (
        <Summary
          title={examTitle}
          candidate={candidateName}
          score={correctCount}
          total={questions.length}
          elapsedTime={elapsedTime}
          remainingTime={remainingTime}
          maxScore={500}
        />
      ) : (
        <div className="exam-container">
          <h1 className="exam-title">{examTitle}</h1>
          <div className="flex justify-between items-center mb-3">
            <Timer
              duration={examDuration * 60}
              onTimeUp={finishExam}
              onTick={(sec) => setRemainingTime(sec)}
            />
            <ElapsedTimer onTick={(sec) => setElapsedTime(sec)} />
          </div>
          <p className="question-progress">
            Domanda {currentIndex + 1} di {questions.length}
          </p>
          <QuestionCard
            data={questions[currentIndex]}
            index={currentIndex}
            selected={selectedAnswers[currentIndex] || []}
            onAnswerChange={handleAnswerChange}
          />
          {showError && (
            <div className="error-msg">
              Devi selezionare esattamente {questions[currentIndex].answersnumber} risposta(e) per proseguire.
            </div>
          )}
          <div className="navigation-buttons">
            <button className="btn" disabled={currentIndex === 0} onClick={handleBack}>
              Indietro
            </button>
            {currentIndex < questions.length - 1 ? (
              <button className="btn" onClick={handleNext}>
                Avanti
              </button>
            ) : (
              <button className="btn btn-finish" onClick={finishExam}>
                Termina Esame
              </button>
            )}
          </div>
        </div>
      )}

      {showInfo && (
        <div className="info-popup">
          <div className="info-content">
            <h3>examgrid</h3>
            <p>versione: <strong>{pkgjson.version}</strong></p>
            <p>build: <strong>{pkgjson.build}</strong></p>
            <p>ultimo aggiornamento: <strong>{pkgjson.updated}</strong></p>
            <p><strong>Copyright © 2025 vIT di Veronesi Lorenzo</strong></p>
            <button className="btn" onClick={() => setShowInfo(false)}>Chiudi</button>
          </div>
        </div>
      )}

      <footer className="footer">
        Copyright © 2025 vIT di Veronesi Lorenzo | All rights reserved.
      </footer>
    </>
  );
}
