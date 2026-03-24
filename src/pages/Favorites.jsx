import { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";
import { getDataKey } from "../services/user";

function Favorites() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(getDataKey("favorites"))) || [];
    setFavorites(saved);
  }, []);

  // Recheck favorites when component mounts or nav occurs
  useEffect(() => {
    const handleStorageChange = () => {
      const saved = JSON.parse(localStorage.getItem(getDataKey("favorites"))) || [];
      setFavorites(saved);
    };

    const handleUserChange = () => {
      const saved = JSON.parse(localStorage.getItem(getDataKey("favorites"))) || [];
      setFavorites(saved);
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("userChanged", handleUserChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("userChanged", handleUserChange);
    };
  }, []);

  return (
    <div className="app-container">
      <h1>❤️ My Favorites</h1>
      
      {favorites.length === 0 ? (
        <p style={{textAlign: "center", color: "#aaa", fontSize: "18px", marginTop: "40px"}}>
          No favorites yet. Start adding movies to your favorites! 🍿
        </p>
      ) : (
        <>
          <p style={{color: "#aaa", marginBottom: "20px"}}>
            You have {favorites.length} favorite{favorites.length !== 1 ? "s" : ""}
          </p>
          <div className="movie-grid">
            {favorites.map((movie) => (
              <MovieCard
                key={movie.imdbID}
                movie={movie}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Favorites;
