import React from "react";
import AnimatedLogo from "./AnimatedLogo.jsx";

export default function SplashScreen({ exiting }) {
  return (
    <div className={`login-page splash-page${exiting ? " is-exiting" : ""}`}>
      <AnimatedLogo className="al-lg" />
    </div>
  );
}
