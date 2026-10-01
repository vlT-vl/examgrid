import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { HiOutlineTicket } from "react-icons/hi2";
import VoucherPanel from "./VoucherPanel.jsx";
import { useLang } from "../uiText.jsx";

const TRANSITION_MS = 400;

export default function VoucherGate({ fullName, examId }) {
  const { t } = useLang();
  const [phase, setPhase] = useState("closed");
  const slotRef = useRef(null);
  const innerRef = useRef(null);
  const pillRef = useRef(null);

  const showPill = phase !== "open";
  const showPanel = phase !== "closed";

  const openVoucher = () => {
    if (phase !== "closed") return;
    setPhase("opening");
    setTimeout(() => setPhase("open"), TRANSITION_MS);
  };

  const closeVoucher = () => {
    if (phase !== "open") return;
    setPhase("closing");
    setTimeout(() => setPhase("closed"), TRANSITION_MS);
  };

  useEffect(() => {
    const outer = slotRef.current;
    const inner = innerRef.current;
    if (!outer || !inner || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(([entry]) => {
      outer.style.height = `${entry.contentRect.height}px`;
    });
    ro.observe(inner);
    return () => ro.disconnect();
  }, []);

  useLayoutEffect(() => {
    if (phase === "closing" && slotRef.current && pillRef.current) {
      const pill = pillRef.current;
      const marginBottom = parseFloat(getComputedStyle(pill).marginBottom) || 0;
      slotRef.current.style.height = `${pill.offsetHeight + marginBottom}px`;
    }
  }, [phase]);

  return (
    <div className="voucher-slot" ref={slotRef}>
      <div className="voucher-slot-inner" ref={innerRef}>
        {showPill && (
          <button
            ref={pillRef}
            type="button"
            className={`voucher-request-pill${phase === "opening" ? " voucher-request-pill--exit" : ""}`}
            onClick={openVoucher}
          >
            <HiOutlineTicket className="voucher-request-icon" aria-hidden="true" />
            {t("voucher.requestButton")}
          </button>
        )}

        {showPanel && (
          <div className={`voucher-panel-wrap${phase === "closing" ? " voucher-panel-wrap--exit" : ""}`}>
            <VoucherPanel fullName={fullName} examId={examId} onClose={closeVoucher} />
          </div>
        )}
      </div>
    </div>
  );
}
