import React from "react";
import { HiOutlineMagnifyingGlass } from "react-icons/hi2";

export default function SearchBar({ value, onChange, placeholder }) {
  return (
    <div className="search-bar">
      <HiOutlineMagnifyingGlass className="search-bar-icon" aria-hidden="true" />
      <input
        className="search-bar-input"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
      />
    </div>
  );
}
