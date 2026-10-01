import React, { useMemo, useState } from "react";
import { HiOutlineSquares2X2 } from "react-icons/hi2";
import ExamCard from "./ExamCard.jsx";
import SearchBar from "./SearchBar.jsx";
import { useLang } from "../uiText.jsx";

export default function Home({ exams, categoryIcons, categoryStyles, categoryLabels, onSelectExam }) {
  const { t } = useLang();
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = useMemo(
    () =>
      [...new Set(exams.map((exam) => exam.category))].sort((a, b) =>
        categoryLabels[a].localeCompare(categoryLabels[b])
      ),
    [exams, categoryLabels]
  );

  const filteredExams = exams
    .filter((exam) => activeCategory === "all" || exam.category === activeCategory)
    .filter((exam) => {
      const query = searchQuery.trim().toLowerCase();
      if (!query) return true;
      return (
        exam.title.toLowerCase().includes(query) ||
        exam.code.toLowerCase().includes(query) ||
        exam.description.toLowerCase().includes(query) ||
        exam.categoryLabel.toLowerCase().includes(query)
      );
    });

  return (
    <div className="home-view">
      <div className="home-title-row">
        <h2 className="home-title">{t("home.title")}</h2>
        <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder={t("home.searchPlaceholder")} />
      </div>

      <div className="home-layout">
        {categories.length > 0 && (
          <div className="category-filter">
            <button
              className={`category-pill${activeCategory === "all" ? " category-pill--active" : ""}`}
              onClick={() => setActiveCategory("all")}
              type="button"
            >
              <HiOutlineSquares2X2 className="category-pill-icon" aria-hidden="true" />
              {t("home.allCategories")}
            </button>
            {categories.map((categoryKey) => {
              const Icon = categoryIcons[categoryKey];
              const style = categoryStyles[categoryKey];
              return (
                <button
                  key={categoryKey}
                  className={`category-pill${activeCategory === categoryKey ? " category-pill--active" : ""}`}
                  style={{ "--tag-color": style.color, "--tag-bg": style.bg }}
                  onClick={() => setActiveCategory(categoryKey)}
                  type="button"
                >
                  {Icon && <Icon className="category-pill-icon" aria-hidden="true" />}
                  {categoryLabels[categoryKey]}
                </button>
              );
            })}
          </div>
        )}

        <div className="home-content">
          {filteredExams.length === 0 ? (
            <p className="home-empty">{t("home.empty")}</p>
          ) : (
            <div className="exam-grid">
              {filteredExams.map((exam, index) => (
                <ExamCard key={exam.id} exam={exam} index={index} onSelect={onSelectExam} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
