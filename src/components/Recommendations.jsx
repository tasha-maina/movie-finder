import { useState, useEffect } from "react";
import MovieCard from "./MovieCard";
import LoadingSkeleton from "./LoadingSkeleton";
import { searchMovies } from "../services/api";
import { getDataKey } from "../services/user";

function Recommendations() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    generateRecommendations();

    window.addEventListener('userChanged', generateRecommendations);
    return () => window.removeEventListener('userChanged', generateRecommendations);
  }, []);

  const generateRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get user's favorites and watchlist
      const favorites = JSON.parse(localStorage.getItem(getDataKey("favorites"))) || [];
      const watchlist = JSON.parse(localStorage.getItem(getDataKey("watchlist"))) || [];

      // If no favorites, show trending/popular movies
      if (favorites.length === 0) {
        const popularMovies = await searchMovies("popular movies", 1);
        setRecommendations(popularMovies.slice(0, 12));
        setLoading(false);
        return;
      }

      // Extract unique genres from favorites
      const favoriteGenres = new Set();
      const favoriteActors = new Set();
      const favoriteDirectors = new Set();

      favorites.forEach(movie => {
        if (movie.Genre) {
          movie.Genre.split(', ').forEach(genre => favoriteGenres.add(genre));
        }
        if (movie.Actors) {
          movie.Actors.split(', ').slice(0, 2).forEach(actor => favoriteActors.add(actor.trim()));
        }
        if (movie.Director && movie.Director !== "N/A") {
          favoriteDirectors.add(movie.Director);
        }
      });

      const allRecommendations = [];
      const usedMovieIds = new Set();

      // Add movies from favorite genres
      const genreArray = Array.from(favoriteGenres);
      for (const genre of genreArray.slice(0, 2)) { // Limit to 2 genres
        try {
          const genreMovies = await searchMovies(genre, 1);
          const filteredMovies = genreMovies.filter(movie => {
            const isInFavorites = favorites.some(fav => fav.imdbID === movie.imdbID);
            const isInWatchlist = watchlist.some(item => item.imdbID === movie.imdbID);
            const alreadyUsed = usedMovieIds.has(movie.imdbID);
            return !isInFavorites && !isInWatchlist && !alreadyUsed;
          });

          filteredMovies.slice(0, 3).forEach(movie => {
            allRecommendations.push({...movie, reason: `Because you like ${genre} movies`});
            usedMovieIds.add(movie.imdbID);
          });
        } catch (err) {
          console.warn(`Failed to fetch ${genre} movies:`, err);
        }
      }

      // Add movies with favorite actors (if we have actor data)
      if (favoriteActors.size > 0 && allRecommendations.length < 6) {
        const actorArray = Array.from(favoriteActors);
        for (const actor of actorArray.slice(0, 1)) { // Just one actor to avoid too many API calls
          try {
            const actorMovies = await searchMovies(actor, 1);
            const filteredMovies = actorMovies.filter(movie => {
              const isInFavorites = favorites.some(fav => fav.imdbID === movie.imdbID);
              const isInWatchlist = watchlist.some(item => item.imdbID === movie.imdbID);
              const alreadyUsed = usedMovieIds.has(movie.imdbID);
              return !isInFavorites && !isInWatchlist && !alreadyUsed;
            });

            filteredMovies.slice(0, 3).forEach(movie => {
              allRecommendations.push({...movie, reason: `Starring ${actor}`});
              usedMovieIds.add(movie.imdbID);
            });
          } catch (err) {
            console.warn(`Failed to fetch ${actor} movies:`, err);
          }
        }
      }

      // Fill remaining slots with general recommendations
      if (allRecommendations.length < 12) {
        try {
          const generalMovies = await searchMovies("top rated movies", 1);
          const filteredMovies = generalMovies.filter(movie => {
            const isInFavorites = favorites.some(fav => fav.imdbID === movie.imdbID);
            const isInWatchlist = watchlist.some(item => item.imdbID === movie.imdbID);
            const alreadyUsed = usedMovieIds.has(movie.imdbID);
            return !isInFavorites && !isInWatchlist && !alreadyUsed;
          });

          filteredMovies.slice(0, 12 - allRecommendations.length).forEach(movie => {
            allRecommendations.push({...movie, reason: "Highly rated movies you might enjoy"});
            usedMovieIds.add(movie.imdbID);
          });
        } catch (err) {
          console.warn("Failed to fetch general recommendations:", err);
        }
      }

      // Shuffle recommendations for variety
      const shuffled = allRecommendations.sort(() => 0.5 - Math.random());
      setRecommendations(shuffled.slice(0, 12));

    } catch (err) {
      setError("Failed to load recommendations");
      console.error("Recommendations error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="recommendations-section">
        <h2>🎯 Recommended for You</h2>
        <div className="recommendations-grid">
          {Array.from({ length: 6 }, (_, i) => (
            <LoadingSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="recommendations-section">
        <h2>🎯 Recommended for You</h2>
        <p className="error-message">{error}</p>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="recommendations-section">
        <h2>🎯 Recommended for You</h2>
        <div className="empty-state">
          <p>Add some movies to your favorites to get personalized recommendations! 🍿</p>
        </div>
      </div>
    );
  }

  return (
    <div className="recommendations-section">
      <h2>🎯 Recommended for You</h2>
      <p className="recommendations-subtitle">
        Personalized recommendations based on your favorites
      </p>
      <div className="recommendations-grid">
        {recommendations.map((movie) => (
          <div key={movie.imdbID} className="recommendation-card">
            <MovieCard movie={movie} />
            {movie.reason && (
              <div className="recommendation-reason">
                {movie.reason}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Recommendations;