import React from "react";
import "../css/VltLogo.css";
import vltcube from "../../res/vltcube.svg";

export default function VltLogo({ size = "1.75rem", staticExpanded = false }) {
  return (
    <div
      className={`vlt-logo${staticExpanded ? " vlt-logo--static" : ""}`}
      style={{ "--cube-w": size }}
    >
      <img className="vlt-cube" src={vltcube} alt="vlT" />
      <span className="vlt-text">vlT</span>
    </div>
  );
}
