const HISTORY_PREFIX = "examgrid-history:";
const HISTORY_SEEN_PREFIX = "examgrid-history-seen:";

export const HISTORY_FORMAT = "examgrid-history";
export const HISTORY_VERSION = 1;

const storageKey = (username) => `${HISTORY_PREFIX}${username}`;
const seenStorageKey = (username) => `${HISTORY_SEEN_PREFIX}${username}`;

const isObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);

export const isValidQuestion = (question) => (
  isObject(question)
  && typeof question.question === "string"
  && Array.isArray(question.answers)
  && question.answers.every((answer) => typeof answer === "string")
  && Array.isArray(question.correctAnswers)
  && question.correctAnswers.every((answer) => typeof answer === "string")
  && Number.isInteger(question.answersnumber)
  && question.answersnumber > 0
);

const isValidEntry = (entry) => (
  isObject(entry)
  && typeof entry.id === "string"
  && entry.id.length > 0
  && typeof entry.completedAt === "string"
  && !Number.isNaN(Date.parse(entry.completedAt))
  && isObject(entry.exam)
  && typeof entry.exam.title === "string"
  && isObject(entry.candidate)
  && typeof entry.candidate.name === "string"
  && isObject(entry.result)
  && Number.isInteger(entry.result.correctCount)
  && entry.result.correctCount >= 0
  && Number.isInteger(entry.result.total)
  && entry.result.total > 0
  && entry.result.correctCount <= entry.result.total
  && Number.isFinite(entry.result.maxScore)
  && entry.result.maxScore > 0
  && Number.isFinite(entry.result.passingScore)
  && entry.result.passingScore >= 0
  && entry.result.passingScore <= entry.result.maxScore
  && isObject(entry.timing)
  && Number.isFinite(entry.timing.elapsedTime)
  && Number.isFinite(entry.timing.remainingTime)
  && Array.isArray(entry.questions)
  && entry.questions.every(isValidQuestion)
  && entry.questions.length === entry.result.total
  && isObject(entry.selectedAnswers)
  && Object.values(entry.selectedAnswers).every(
    (answers) => Array.isArray(answers) && answers.every((answer) => typeof answer === "string")
  )
);

const newestFirst = (a, b) => Date.parse(b.completedAt) - Date.parse(a.completedAt);

export function createHistoryId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function readExamHistory(username) {
  if (!username) return [];
  try {
    const parsed = JSON.parse(sessionStorage.getItem(storageKey(username)) || "[]");
    return Array.isArray(parsed) ? parsed.filter(isValidEntry).sort(newestFirst) : [];
  } catch {
    return [];
  }
}

export function writeExamHistory(username, entries) {
  if (!username) return;
  sessionStorage.setItem(storageKey(username), JSON.stringify(entries));
}

export function readSeenHistoryIds(username) {
  if (!username) return [];
  try {
    const parsed = JSON.parse(sessionStorage.getItem(seenStorageKey(username)) || "[]");
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === "string") : [];
  } catch {
    return [];
  }
}

export function writeSeenHistoryIds(username, ids) {
  if (!username) return;
  sessionStorage.setItem(seenStorageKey(username), JSON.stringify(ids));
}

export function mergeExamHistory(currentEntries, importedEntries) {
  const merged = new Map();
  [...currentEntries, ...importedEntries].filter(isValidEntry).forEach((entry) => {
    if (!merged.has(entry.id)) merged.set(entry.id, entry);
  });
  return Array.from(merged.values()).sort(newestFirst);
}

export function parseHistoryArchive(value, expectedUsername) {
  if (!isObject(value) || value.format !== HISTORY_FORMAT || value.version !== HISTORY_VERSION) {
    throw new Error("format");
  }
  if (value.username !== expectedUsername) throw new Error("user");
  if (!Array.isArray(value.sessions) || !value.sessions.every(isValidEntry)) throw new Error("data");
  return value.sessions;
}

export function createHistoryArchive(username, entries) {
  return {
    format: HISTORY_FORMAT,
    version: HISTORY_VERSION,
    exportedAt: new Date().toISOString(),
    username,
    sessions: entries,
  };
}
