import { isValidQuestion } from "./examHistory.js";

const PROGRESS_PREFIX = "examgrid-progress:";

const storageKey = (username) => `${PROGRESS_PREFIX}${username}`;

const isObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);

const isValidProgress = (progress) => (
  isObject(progress)
  && typeof progress.examId === "string"
  && progress.examId.length > 0
  && typeof progress.examTitle === "string"
  && typeof progress.candidateName === "string"
  && Number.isInteger(progress.currentIndex)
  && progress.currentIndex >= 0
  && Array.isArray(progress.questions)
  && progress.questions.every(isValidQuestion)
  && isObject(progress.selectedAnswers)
  && Object.values(progress.selectedAnswers).every(
    (answers) => Array.isArray(answers) && answers.every((answer) => typeof answer === "string")
  )
  && Number.isFinite(progress.examDuration)
  && progress.examDuration > 0
  && Number.isFinite(progress.remainingTime)
  && progress.remainingTime >= 0
  && Number.isFinite(progress.elapsedTime)
  && progress.elapsedTime >= 0
  && typeof progress.showAnswers === "boolean"
);

export function readExamProgress(username) {
  if (!username) return null;
  try {
    const parsed = JSON.parse(sessionStorage.getItem(storageKey(username)) || "null");
    return isValidProgress(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function writeExamProgress(username, progress) {
  if (!username) return;
  try {
    sessionStorage.setItem(storageKey(username), JSON.stringify({ ...progress, savedAt: new Date().toISOString() }));
  } catch {}
}

export function clearExamProgress(username) {
  if (!username) return;
  try {
    sessionStorage.removeItem(storageKey(username));
  } catch {}
}
