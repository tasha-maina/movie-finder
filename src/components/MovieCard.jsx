import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getDataKey, getCurrentUser } from "../services/user";

function MovieCard({ movie }) {
  const [loaded, setLoaded] = useState(true);
  const [showOverlay, setShowOverlay] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [watchlistStatus, setWatchlistStatus] = useState(null);
  const [user, setUser] = useState(getCurrentUser());

  useEffect(() => {
    const checkState = () => {
      const favorites = JSON.parse(localStorage.getItem(getDataKey("favorites"))) || [];
      setIsFavorite(favorites.some(fav => fav.imdbID === movie.imdbID));

      const watchlist = JSON.parse(localStorage.getItem(getDataKey("watchlist"))) || {};
      if (watchlist[movie.imdbID]) {
        setWatchlistStatus(watchlist[movie.imdbID].status);
      } else {
        setWatchlistStatus(null);
      }
    };

    checkState();

    window.addEventListener('userChanged', checkState);
    return () => window.removeEventListener('userChanged', checkState);
  }, [movie.imdbID]);

  const toggleFavorite = (e) => {
    e.preventDefault();
    const key = getDataKey("favorites");
    const favorites = JSON.parse(localStorage.getItem(key)) || [];
    
    if (isFavorite) {
      const updated = favorites.filter(fav => fav.imdbID !== movie.imdbID);
      localStorage.setItem(key, JSON.stringify(updated));
    } else {
      favorites.push(movie);
      localStorage.setItem(key, JSON.stringify(favorites));
    }
    
    setIsFavorite(!isFavorite);
  };

  const addToWatchlist = (status, e) => {
    e.preventDefault();
    const key = getDataKey("watchlist");
    const watchlist = JSON.parse(localStorage.getItem(key)) || {};
    
    if (watchlistStatus === status) {
      // Remove from watchlist
      delete watchlist[movie.imdbID];
      setWatchlistStatus(null);
    } else {
      // Add to watchlist
      watchlist[movie.imdbID] = {
        movie,
        status,
        addedDate: new Date().toISOString()
      };
      setWatchlistStatus(status);
    }
    
    localStorage.setItem(key, JSON.stringify(watchlist));
  };

  // Don't render if image fails to load
  if (!loaded) return null;

  return (
    <Link
      to={`/movie/${movie.imdbID}`}
      className="movie-link"
    >
      <div 
        className="movie-card"
        onMouseEnter={() => setShowOverlay(true)}
        onMouseLeave={() => setShowOverlay(false)}
      >
        <button
          className={`favorite-btn ${isFavorite ? "active" : ""}`}
          onClick={toggleFavorite}
          title={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          {isFavorite ? "❤️" : "🤍"}
        </button>

        <img
          src={movie.Poster}
          alt={movie.Title}
          onLoad={() => setLoaded(true)}
          onError={() => setLoaded(false)}
        />
        
        {showOverlay && (
          <div className="movie-overlay">
            <h3>{movie.Title}</h3>
            <div className="movie-rating">
              ⭐ {movie.imdbRating || "N/A"}
            </div>
            <p className="movie-plot">
              {movie.Plot && movie.Plot.length > 100 
                ? movie.Plot.substring(0, 100) + "..." 
                : movie.Plot || "No plot available"}
            </p>
            <p className="movie-genre">{movie.Genre}</p>

            <div className="overlay-buttons">
              <button
                className="trailer-btn"
                onClick={(e) => {
                  e.preventDefault();
                  window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(movie.Title + " official trailer")}`, '_blank');
                }}
              >
                ▶ Trailer
              </button>

              <div className="watchlist-buttons">
                <button
                  className={`watchlist-btn ${watchlistStatus === 'want-to-watch' ? 'active' : ''}`}
                  onClick={(e) => addToWatchlist('want-to-watch', e)}
                  title="Want to Watch"
                >
                  👀
                </button>
                <button
                  className={`watchlist-btn ${watchlistStatus === 'watching' ? 'active' : ''}`}
                  onClick={(e) => addToWatchlist('watching', e)}
                  title="Currently Watching"
                >
                  ▶️
                </button>
                <button
                  className={`watchlist-btn ${watchlistStatus === 'watched' ? 'active' : ''}`}
                  onClick={(e) => addToWatchlist('watched', e)}
                  title="Already Watched"
                >
                  ✅
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}

export default MovieCard;