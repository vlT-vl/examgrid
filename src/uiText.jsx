import { createContext, createElement, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "examgrid-lang";
const LANGS = new Set(["it", "en"]);
const DEFAULT_LANG = "it";

export const uiText = {
  it: {
    app: {
      loadError: "Impossibile contattare il registro esami: {message}",
    },
    nav: {
      home: "Home",
      info: "Info",
      history: "Storico esami",
      logout: "Esci",
    },
    theme: {
      light: "Tema Chiaro",
      dark: "Tema Scuro",
      switchToLight: "Passa al tema chiaro",
      switchToDark: "Passa al tema scuro",
    },
    lang: {
      switchTo: "Passa all'inglese",
    },
    login: {
      welcome: "Bentornato",
      subtitle: "Accedi alla piattaforma examgrid",
      username: "Utente",
      password: "Password",
      invalidCredentials: "Credenziali non valide.",
      loading: "Accesso in corso…",
      submit: "Accedi",
    },
    home: {
      title: "Esami disponibili",
      allCategories: "Tutti",
      empty: "Nessun esame disponibile al momento.",
      searchPlaceholder: "Cerca esame…",
    },
    exam: {
      loading: "Caricamento domande...",
      progress: "Domanda {current} di {total}",
      back: "Indietro",
      next: "Avanti",
      finish: "Termina Esame",
      loadError: "Errore caricamento quiz: {message}",
      cancel: "Termina esame",
      cancelTitle: "Terminare l'esame?",
      cancelConfirm: "Vuoi terminare l'esame adesso? Le risposte date finora verranno conteggiate e vedrai subito il risultato.",
      cancelConfirmBtn: "Termina ora",
      cancelDismissBtn: "Annulla",
      revealAnswer: "Mostra risposta corretta",
      hideAnswer: "Nascondi risposta corretta",
      selectOne: "Seleziona 1 risposta",
      selectMany: "Seleziona {count} risposte",
      lastUpdatedLabel: "Ultimo aggiornamento: {date}",
    },
    examDetail: {
      back: "Indietro",
      candidate: "Candidato",
      start: "Avvia Esame",
      duration: "Durata",
      questions: "Domande",
      lastUpdate: "Aggiornato",
      language: "Lingua",
    },
    examStart: {
      examLabel: "Esame: {code}",
      questions: "Domande",
      duration: "Durata",
      warning: "Una volta avviato l'esame, terminandolo prima della fine il risultato verrà comunque calcolato in base alle risposte date fino a quel momento.",
      showAnswers: "Mostra risposte corrette",
      range: "Intervallo domande",
      rangeFrom: "Dalla domanda",
      rangeTo: "Alla domanda",
      random: "Ordine casuale",
      start: "Avvia",
    },
    voucher: {
      requestButton: "Richiedi voucher",
      title: "Sblocco esame richiesto",
      close: "Chiudi",
      intro: "Per avviare l'esame serve un voucher valido. Invia il codice richiesta all'amministratore per riceverne uno.",
      requestFor: "Codice richiesta per {name}",
      copy: "Copia",
      copied: "Copiato",
      sendToBefore: "Copia il codice e invialo all'amministratore per ricevere il voucher.",
      redeemLabel: "Hai già un voucher?",
      redeemPlaceholder: "Incolla qui il voucher",
      redeem: "Sblocca",
      err: {
        format: "Voucher non valido: controlla di averlo copiato per intero.",
        invalid: "Firma non valida: il voucher non è autentico.",
        unsupported: "Il browser non supporta la verifica del voucher.",
        unavailable: "Sistema voucher non ancora attivo.",
        expired: "Questo voucher è scaduto: richiedine uno nuovo.",
        examMismatch: "Questo voucher è valido per un altro esame.",
      },
    },
    timer: {
      remaining: "Tempo rimanente:",
      elapsed: "Tempo trascorso:",
    },
    summary: {
      correctAnswers: "Risposte corrette: {score} su {total}",
      points: "{score} / {max} punti",
      elapsed: "Tempo trascorso: {time}",
      remaining: "Tempo rimanente: {time}",
      passed: "Promosso",
      failed: "Bocciato",
      download: "Scarica Report HTML",
      reportTitle: "Report Esame",
      minutes: "minuti",
      seconds: "secondi",
      field: {
        candidate: "Candidato",
        exam: "Esame",
        category: "Categoria",
        date: "Data",
        correct: "Risposte corrette",
        elapsed: "Tempo impiegato",
        remaining: "Tempo rimanente",
        passingScore: "Punteggio minimo",
        yourScore: "Punteggio ottenuto",
        grade: "Esito",
      },
      disclaimerMain: "Questo documento è un report di simulazione d'esame generato da examgrid e non costituisce una certificazione ufficiale.",
      disclaimerLegal: "Contenuto e punteggio hanno solo scopo di autovalutazione ed esercitazione personale. examgrid non è affiliato né certificato da alcun vendor o ente di certificazione.",
      review: {
        pill: "Rivedi le risposte",
        title: "Dettaglio risposte",
        number: "#",
        question: "Domanda",
        yourAnswer: "La tua risposta",
        correctAnswer: "Risposta corretta",
        result: "Esito",
        correct: "Corretta",
        incorrect: "Errata",
        noAnswer: "Nessuna risposta",
        prevPage: "Precedente",
        nextPage: "Successiva",
        pageOf: "Pagina {page} di {total}",
      },
    },
    history: {
      eyebrow: "Sessione browser",
      title: "Storico prove d'esame",
      close: "Chiudi storico",
      warning: "Lo storico è conservato solo nella sessione corrente del browser e andrà perso alla chiusura della scheda. Esportalo in JSON per conservarlo; quando lo ricarichi, le prove importate si uniscono a quelle già presenti e alle nuove sessioni.",
      import: "Carica storico JSON",
      export: "Esporta storico JSON",
      importSuccess: "Storico caricato: {count} nuove sessioni aggiunte, {total} totali nel browser.",
      importError: "Il file non è uno storico examgrid valido o contiene dati incompleti.",
      importWrongUser: "Questo storico appartiene a un altro utente e non può essere unito alla sessione corrente.",
      empty: "Non ci sono ancora prove concluse in questa sessione del browser.",
      icon: "Icona",
      exam: "Esame",
      code: "Codice",
      category: "Categoria",
      candidate: "Candidato",
      date: "Data",
      correct: "Risposte corrette",
      elapsed: "Tempo impiegato",
      remaining: "Tempo rimanente",
      passingScore: "Punteggio minimo",
      score: "Punteggio",
      result: "Esito",
      report: "Report",
      open: "Apri",
      openReport: "Apri il report di {exam}",
    },
    footer: {
      copyright: "© 2026 vlT di Veronesi Lorenzo",
    },
    versionModal: {
      eyebrow: "Info",
      close: "Chiudi",
      versionLabel: "Versione",
      buildLabel: "Build",
      updatedLabel: "Aggiornato",
      notice: "examgrid — simulatore di esami professionali.",
      rights: "Tutti i diritti riservati.",
    },
  },
  en: {
    app: {
      loadError: "Could not reach the exam registry: {message}",
    },
    nav: {
      home: "Home",
      info: "Info",
      history: "Exam history",
      logout: "Log out",
    },
    theme: {
      light: "Light theme",
      dark: "Dark theme",
      switchToLight: "Switch to light theme",
      switchToDark: "Switch to dark theme",
    },
    lang: {
      switchTo: "Switch to Italian",
    },
    login: {
      welcome: "Welcome back",
      subtitle: "Sign in to the examgrid platform",
      username: "Username",
      password: "Password",
      invalidCredentials: "Invalid credentials.",
      loading: "Signing in…",
      submit: "Sign in",
    },
    home: {
      title: "Available exams",
      allCategories: "All",
      empty: "No exam available right now.",
      searchPlaceholder: "Search exams…",
    },
    exam: {
      loading: "Loading questions...",
      progress: "Question {current} of {total}",
      back: "Back",
      next: "Next",
      finish: "Finish Exam",
      loadError: "Error loading quiz: {message}",
      cancel: "End exam",
      cancelTitle: "End the exam?",
      cancelConfirm: "Do you want to end the exam now? Your current answers will be scored and you'll see the result right away.",
      cancelConfirmBtn: "End now",
      cancelDismissBtn: "Cancel",
      revealAnswer: "Show correct answer",
      hideAnswer: "Hide correct answer",
      selectOne: "Select 1 answer",
      selectMany: "Select {count} answers",
      lastUpdatedLabel: "Last updated: {date}",
    },
    examDetail: {
      back: "Back",
      candidate: "Candidate",
      start: "Start Exam",
      duration: "Duration",
      questions: "Questions",
      lastUpdate: "Updated",
      language: "Language",
    },
    examStart: {
      examLabel: "Exam: {code}",
      questions: "Questions",
      duration: "Duration",
      warning: "Once the exam starts, ending it early will still score the result based on the answers given up to that point.",
      showAnswers: "Show correct answers",
      range: "Question range",
      rangeFrom: "From question",
      rangeTo: "To question",
      random: "Random order",
      start: "Start",
    },
    voucher: {
      requestButton: "Request voucher",
      title: "Exam unlock required",
      close: "Close",
      intro: "Starting the exam needs a valid voucher. Send the request code to the administrator to get one.",
      requestFor: "Request code for {name}",
      copy: "Copy",
      copied: "Copied",
      sendToBefore: "Copy the code and send it to the administrator to receive the voucher.",
      redeemLabel: "Already have a voucher?",
      redeemPlaceholder: "Paste the voucher here",
      redeem: "Unlock",
      err: {
        format: "Invalid voucher: check that you copied it in full.",
        invalid: "Invalid signature: this voucher is not authentic.",
        unsupported: "This browser can't verify the voucher.",
        unavailable: "The voucher system isn't active yet.",
        expired: "This voucher has expired: request a new one.",
        examMismatch: "This voucher is valid for a different exam.",
      },
    },
    timer: {
      remaining: "Time remaining:",
      elapsed: "Time elapsed:",
    },
    summary: {
      correctAnswers: "Correct answers: {score} out of {total}",
      points: "{score} / {max} points",
      elapsed: "Time elapsed: {time}",
      remaining: "Time remaining: {time}",
      passed: "Passed",
      failed: "Failed",
      download: "Download HTML Report",
      reportTitle: "Exam Report",
      minutes: "minutes",
      seconds: "seconds",
      field: {
        candidate: "Candidate",
        exam: "Exam",
        category: "Category",
        date: "Date",
        correct: "Correct answers",
        elapsed: "Time taken",
        remaining: "Time remaining",
        passingScore: "Passing score",
        yourScore: "Your score",
        grade: "Grade",
      },
      disclaimerMain: "This document is a practice exam simulation report generated by examgrid and is not proof of any official certification.",
      disclaimerLegal: "Content and score are for self-assessment and personal practice only. examgrid is not affiliated with or certified by any vendor or certification body.",
      review: {
        pill: "Review answers",
        title: "Answer details",
        number: "#",
        question: "Question",
        yourAnswer: "Your answer",
        correctAnswer: "Correct answer",
        result: "Result",
        correct: "Correct",
        incorrect: "Incorrect",
        noAnswer: "No answer given",
        prevPage: "Previous",
        nextPage: "Next",
        pageOf: "Page {page} of {total}",
      },
    },
    history: {
      eyebrow: "Browser session",
      title: "Exam attempt history",
      close: "Close history",
      warning: "History is kept only in the current browser session and will be lost when this tab is closed. Export it as JSON to keep it; when loaded again, imported attempts are merged with existing and new sessions.",
      import: "Load history JSON",
      export: "Export history JSON",
      importSuccess: "History loaded: {count} new sessions added, {total} total in this browser.",
      importError: "This file is not a valid examgrid history or contains incomplete data.",
      importWrongUser: "This history belongs to another user and cannot be merged into the current session.",
      empty: "No exam attempts have been completed in this browser session yet.",
      icon: "Icon",
      exam: "Exam",
      code: "Code",
      category: "Category",
      candidate: "Candidate",
      date: "Date",
      correct: "Correct answers",
      elapsed: "Time taken",
      remaining: "Time remaining",
      passingScore: "Passing score",
      score: "Score",
      result: "Result",
      report: "Report",
      open: "Open",
      openReport: "Open the report for {exam}",
    },
    footer: {
      copyright: "© 2026 vlT di Veronesi Lorenzo",
    },
    versionModal: {
      eyebrow: "Info",
      close: "Close",
      versionLabel: "Version",
      buildLabel: "Build",
      updatedLabel: "Updated",
      notice: "examgrid — professional exam simulator.",
      rights: "All rights reserved.",
    },
  },
};

const getPath = (obj, path) => path.split(".").reduce((acc, key) => acc?.[key], obj);

const interpolate = (value, vars) => {
  if (typeof value !== "string" || !vars) return value;
  return value.replace(/\{(\w+)\}/g, (_, key) => (vars[key] ?? ""));
};

export const getLangPreference = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (LANGS.has(saved)) return saved;
  } catch {}
  return DEFAULT_LANG;
};

export const setLangPreference = (lang) => {
  const normalized = LANGS.has(lang) ? lang : DEFAULT_LANG;
  try {
    localStorage.setItem(STORAGE_KEY, normalized);
  } catch {}
  return normalized;
};

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [lang, setLangState] = useState(getLangPreference);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = (next) => setLangState(setLangPreference(next));
  const toggleLang = () => setLang(lang === "it" ? "en" : "it");
  const t = (key, vars) => interpolate(getPath(uiText[lang], key) ?? key, vars);

  return createElement(LanguageContext.Provider, { value: { lang, setLang, toggleLang, t } }, children);
};

export const useLang = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used within a LanguageProvider");
  return ctx;
};
