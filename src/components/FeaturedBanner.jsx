import { useNavigate } from "react-router-dom";

function FeaturedBanner({ movie }) {
  const navigate = useNavigate();

  if (!movie) return null;

  return (
    <div 
      className="featured-banner"
      style={{
        backgroundImage: `url(${movie.Poster})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="featured-overlay">
        <div className="featured-content">
          <h1>{movie.Title}</h1>
          <div className="featured-info">
            <span className="featured-year">{movie.Year}</span>
            <span className="featured-rating">⭐ {movie.imdbRating || "N/A"}</span>
            <span className="featured-runtime">{movie.Runtime}</span>
          </div>
          <p className="featured-plot">
            {movie.Plot}
          </p>
          <div className="featured-buttons">
            <button 
              className="btn-primary"
              onClick={() => navigate(`/movie/${movie.imdbID}`)}
            >
              ▶ Watch Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FeaturedBanner;
