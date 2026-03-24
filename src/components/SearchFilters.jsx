import { useState } from "react";

function SearchFilters({ onFilterChange, onSortChange }) {
  const [sortBy, setSortBy] = useState("title");
  const [sortOrder, setSortOrder] = useState("asc");

  const handleSortChange = (newSortBy) => {
    const newOrder = sortBy === newSortBy && sortOrder === "asc" ? "desc" : "asc";
    setSortBy(newSortBy);
    setSortOrder(newOrder);
    onSortChange(newSortBy, newOrder);
  };

  return (
    <div className="search-filters">
      <div className="filter-group">
        <label>Sort by:</label>
        <div className="sort-buttons">
          <button
            className={`sort-btn ${sortBy === "title" ? "active" : ""}`}
            onClick={() => handleSortChange("title")}
          >
            Title {sortBy === "title" && (sortOrder === "asc" ? "↑" : "↓")}
          </button>
          <button
            className={`sort-btn ${sortBy === "year" ? "active" : ""}`}
            onClick={() => handleSortChange("year")}
          >
            Year {sortBy === "year" && (sortOrder === "asc" ? "↑" : "↓")}
          </button>
          <button
            className={`sort-btn ${sortBy === "rating" ? "active" : ""}`}
            onClick={() => handleSortChange("rating")}
          >
            Rating {sortBy === "rating" && (sortOrder === "asc" ? "↑" : "↓")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default SearchFilters;