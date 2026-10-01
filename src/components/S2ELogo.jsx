import React from "react";

export default function S2ELogo({ className }) {
  return (
    <svg className={`s2e-logo${className ? ` ${className}` : ""}`} viewBox="0 0 81.15 100.64" role="img" aria-label="S2E">
      <path className="s2e-logo-cyan" fillRule="evenodd" d="M34.62,20.34v7.52c10.23,2.36,17.86,11.51,17.86,22.46s-7.63,20.11-17.86,22.46v7.52c14.33-2.46,25.24-14.94,25.24-29.98s-10.91-27.51-25.24-29.98" />
      <path className="s2e-logo-navy" fillRule="evenodd" d="M25.24,72.78c-10.23-2.36-17.86-11.51-17.86-22.46s7.63-20.1,17.86-22.46v-7.52C10.91,22.81,0,35.29,0,50.32s10.91,27.51,25.24,29.98v-7.52Z" />
      <path className="s2e-logo-cyan" fillRule="evenodd" d="M68.84,45.19h12.31C78.7,20.93,59.07,1.75,34.62,0v12.27c17.7,1.68,31.87,15.43,34.22,32.92" />
      <path className="s2e-logo-navy" fillRule="evenodd" d="M68.82,55.57c-2.39,17.44-16.55,31.13-34.2,32.8v12.27c24.41-1.75,44.01-20.87,46.51-45.07h-12.31Z" />
    </svg>
  );
}
