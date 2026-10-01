import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { createRequestCode, parseVoucherInput, verifyVoucher } from "./lib/voucher.js";

const VOUCHER_PUBLIC_KEY = import.meta.env.VITE_EXAMGRID_VOUCHER_PUBLIC_KEY;
const STORAGE_KEY = "examgrid-voucher";

const readStored = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const writeStored = (value) => {
  try {
    if (value) localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    else localStorage.removeItem(STORAGE_KEY);
  } catch {}
};

const VoucherContext = createContext(null);

export function VoucherProvider({ children }) {
  const [record, setRecord] = useState(readStored);
  const [request, setRequest] = useState(null);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const tick = () => setNow(Date.now());
    const id = setInterval(tick, 60000);
    document.addEventListener("visibilitychange", tick);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", tick);
    };
  }, []);

  useEffect(() => {
    if (record && now >= Date.parse(record.expiresAt)) {
      setRecord(null);
      writeStored(null);
    }
  }, [record, now]);

  const isValidFor = useCallback(
    (examId) => Boolean(record && record.examId === examId && now < Date.parse(record.expiresAt)),
    [record, now]
  );

  const generateRequest = useCallback((name, examId) => {
    const code = createRequestCode(name, examId);
    setRequest({ code, examId });
    return code;
  }, []);

  const requestCodeFor = useCallback(
    (examId) => (request && request.examId === examId ? request.code : null),
    [request]
  );

  const redeem = useCallback(async (voucherText, examId) => {
    const parsed = parseVoucherInput(voucherText);
    if (!parsed) return { ok: false, reason: "format" };
    const result = await verifyVoucher({ ...parsed, publicKey: VOUCHER_PUBLIC_KEY });
    if (!result.ok) return result;
    if (result.examId !== examId) return { ok: false, reason: "examMismatch" };
    const next = { examId: result.examId, name: result.name, expiresAt: result.expiresAt, key: result.key };
    setRecord(next);
    writeStored(next);
    return { ok: true };
  }, []);

  const clear = useCallback(() => {
    setRecord(null);
    setRequest(null);
    writeStored(null);
  }, []);

  return (
    <VoucherContext.Provider value={{ record, isValidFor, requestCodeFor, generateRequest, redeem, clear }}>
      {children}
    </VoucherContext.Provider>
  );
}

export function useVoucher() {
  const ctx = useContext(VoucherContext);
  if (!ctx) throw new Error("useVoucher must be used within a VoucherProvider");
  return ctx;
}
