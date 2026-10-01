import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { openEnvelope } from "./lib/examsCrypto.js";

const REGISTRY_BASE = "https://raw.githubusercontent.com/vlT-vl/examgrid.exams/main";
const PUBLIC_KEY = import.meta.env.VITE_EXAMS_PUBLIC_KEY;
const USERS_KEY = import.meta.env.VITE_EXAMS_USERS_KEY;

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [catalog, setCatalog] = useState(null);
  const [users, setUsers] = useState(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        if (!PUBLIC_KEY || !USERS_KEY) {
          throw new Error("Chiavi di verifica/decifratura mancanti (VITE_EXAMS_PUBLIC_KEY / VITE_EXAMS_USERS_KEY).");
        }

        const [catalogRes, usersRes] = await Promise.all([
          fetch(`${REGISTRY_BASE}/exams/index.json`),
          fetch(`${REGISTRY_BASE}/users.enc.json`),
        ]);
        if (!catalogRes.ok) throw new Error(`Catalogo non raggiungibile (HTTP ${catalogRes.status})`);
        if (!usersRes.ok) throw new Error(`Elenco utenti non raggiungibile (HTTP ${usersRes.status})`);

        const catalogData = await catalogRes.json();
        const usersEnvelope = await usersRes.json();
        const usersData = await openEnvelope(usersEnvelope, {
          publicKeyX: PUBLIC_KEY,
          symmetricKeyBase64: USERS_KEY,
        });

        if (!cancelled) {
          setCatalog(catalogData);
          setUsers(usersData);
          setStatus("ready");
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
          setStatus("error");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const loadExam = useCallback(async (url, contentKeyBase64) => {
    const res = await fetch(`${REGISTRY_BASE}/${url}`);
    if (!res.ok) throw new Error(`Esame non raggiungibile (HTTP ${res.status})`);
    const envelope = await res.json();
    return openEnvelope(envelope, { publicKeyX: PUBLIC_KEY, symmetricKeyBase64: contentKeyBase64 });
  }, []);

  return (
    <DataContext.Provider value={{ catalog, users, status, error, loadExam }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within a DataProvider");
  return ctx;
}
