import { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";
import { getDataKey } from "../services/user";

function Watchlist() {
  const [watchlist, setWatchlist] = useState({});
  const [activeTab, setActiveTab] = useState("want-to-watch");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(getDataKey("watchlist"))) || {};
    setWatchlist(saved);
  }, []);

  // Recheck watchlist when component mounts or nav occurs
  useEffect(() => {
    const handleStorageChange = () => {
      const saved = JSON.parse(localStorage.getItem(getDataKey("watchlist"))) || {};
      setWatchlist(saved);
    };

    const handleUserChange = () => {
      const saved = JSON.parse(localStorage.getItem(getDataKey("watchlist"))) || {};
      setWatchlist(saved);
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("userChanged", handleUserChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("userChanged", handleUserChange);
    };
  }, []);

  const getMoviesByStatus = (status) => {
    return Object.values(watchlist).filter(item => item.status === status);
  };

  const tabs = [
    { id: "want-to-watch", label: "👀 Want to Watch", count: getMoviesByStatus("want-to-watch").length },
    { id: "watching", label: "▶️ Currently Watching", count: getMoviesByStatus("watching").length },
    { id: "watched", label: "✅ Watched", count: getMoviesByStatus("watched").length }
  ];

  const currentMovies = getMoviesByStatus(activeTab);

  return (
    <div className="app-container">
      <h1>📋 My Watchlist</h1>

      <div className="watchlist-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {currentMovies.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            {activeTab === "want-to-watch" && "👀"}
            {activeTab === "watching" && "▶️"}
            {activeTab === "watched" && "✅"}
          </div>
          <h3>No movies in this category</h3>
          <p>
            {activeTab === "want-to-watch" && "Add movies you want to watch later by clicking the 👀 button on movie cards."}
            {activeTab === "watching" && "Mark movies as currently watching by clicking the ▶️ button on movie cards."}
            {activeTab === "watched" && "Mark movies as watched by clicking the ✅ button on movie cards."}
          </p>
        </div>
      ) : (
        <>
          <p style={{color: "#aaa", marginBottom: "20px"}}>
            You have {currentMovies.length} movie{currentMovies.length !== 1 ? "s" : ""} in this category
          </p>
          <div className="movie-grid">
            {currentMovies.map((item) => (
              <MovieCard
                key={item.movie.imdbID}
                movie={item.movie}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Watchlist;