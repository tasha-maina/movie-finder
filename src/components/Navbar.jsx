import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

function Navbar({ theme, toggleTheme }) {
  const [userName, setUserName] = useState("");

  const scrollToTrending = () => {
    if (window.location.pathname === "/") {
      document.getElementById("trending")?.scrollIntoView({
        behavior: "smooth"
      });
    }
  };

  useEffect(() => {
    const updateName = () => {
      const prof = JSON.parse(localStorage.getItem("userProfile")) || {};
      setUserName(prof.name || "");
    };
    updateName();
    window.addEventListener("storage", updateName);
    return () => window.removeEventListener("storage", updateName);
  }, []);

  const scrollToSearch = () => {
    if (window.location.pathname === "/") {
      document.getElementById("search")?.scrollIntoView({
        behavior: "smooth"
      });
    }
  };

  return (
    <nav className="navbar">

      <Link to="/" className="logo-link">
        <div className="logo">🎬 MovieFinder</div>
      </Link>

      <div className="nav-buttons">
        {userName && <span className="nav-username">Hi, {userName}</span>}
        <button onClick={scrollToTrending}>🔥 Trending</button>
        <button onClick={scrollToSearch}>🔍 Search</button>
        <Link to="/favorites">
          <button>❤️ My Favorites</button>
        </Link>
        <Link to="/watchlist">
          <button>📋 Watchlist</button>
        </Link>

        <Link to="/profile">
          <button>👤 Profile</button>
        </Link>

        <button
          className="theme-toggle-btn"
          onClick={toggleTheme}
          title={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
        >
          {theme === "dark" ? "☀️" : "🌙"}
        </button>
      </div>

    </nav>
  );
}

export default Navbar;