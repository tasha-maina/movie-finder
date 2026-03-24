import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getDataKey } from "../services/user";

function MovieDetails() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [error, setError] = useState(null);
  const [userRating, setUserRating] = useState(0);
  const [userReview, setUserReview] = useState("");
  const [reviews, setReviews] = useState([]);

  const API_KEY = "972e65c8";

  useEffect(() => {
    // Load user reviews for this movie
    const savedReviews = JSON.parse(localStorage.getItem(getDataKey("movieReviews"))) || {};
    if (savedReviews[id]) {
      setReviews(savedReviews[id]);
    }

    // Load user's personal rating
    const userRatings = JSON.parse(localStorage.getItem(getDataKey("userRatings"))) || {};
    if (userRatings[id]) {
      setUserRating(userRatings[id]);
    }
  }, [id]);

  useEffect(() => {

    const fetchMovie = async () => {
      try {
        const res = await fetch(
          `https://www.omdbapi.com/?i=${id}&apikey=${API_KEY}`
        );

        if (!res.ok) {
          throw new Error("Failed to fetch movie details");
        }

        const data = await res.json();

        if (data.Response === "False") {
          throw new Error(data.Error || "Movie not found");
        }

        setMovie(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        setMovie(null);
      }
    };

    fetchMovie();

  }, [id]);

  const handleRating = (rating) => {
    setUserRating(rating);
    const key = getDataKey("userRatings");
    const userRatings = JSON.parse(localStorage.getItem(key)) || {};
    userRatings[id] = rating;
    localStorage.setItem(key, JSON.stringify(userRatings));
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!userReview.trim()) return;

    const newReview = {
      id: Date.now(),
      text: userReview,
      date: new Date().toLocaleDateString(),
      rating: userRating
    };

    const key = getDataKey("movieReviews");
    const savedReviews = JSON.parse(localStorage.getItem(key)) || {};
    if (!savedReviews[id]) {
      savedReviews[id] = [];
    }
    savedReviews[id].push(newReview);
    localStorage.setItem(key, JSON.stringify(savedReviews));

    setReviews(savedReviews[id]);
    setUserReview("");
  };

  if (error) return <p className="error-message">Error: {error}</p>;

  if (!movie) return <p>Loading...</p>;

  return (

    <div className="details-container">

      <button
        className="back-btn"
        onClick={() => navigate("/")}
      >
        Back to Movies
      </button>

      <img
        className="details-poster"
        src={movie.Poster}
        alt={movie.Title}
      />

      <div className="details-info">

        <h1>{movie.Title}</h1>

        <p><strong>Year:</strong> {movie.Year}</p>

        <p><strong>Runtime:</strong> {movie.Runtime}</p>

        <p><strong>IMDb Rating:</strong> ⭐ {movie.imdbRating}</p>

        <p><strong>Genre:</strong> {movie.Genre}</p>

        <p><strong>Actors:</strong> {movie.Actors}</p>

        <p><strong>Plot:</strong> {movie.Plot}</p>

        <p><strong>Director:</strong> {movie.Director}</p>

        <p><strong>Writer:</strong> {movie.Writer}</p>

        <p><strong>Awards:</strong> {movie.Awards}</p>

        <p><strong>Box Office:</strong> {movie.BoxOffice}</p>

        <p><strong>Country:</strong> {movie.Country}</p>

        <p><strong>Language:</strong> {movie.Language}</p>

        {/* User Rating Section */}
        <div className="user-rating-section">
          <h3>Your Rating</h3>
          <div className="rating-stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                className={`star ${userRating >= star ? 'active' : ''}`}
                onClick={() => handleRating(star)}
              >
                ⭐
              </button>
            ))}
          </div>
          {userRating > 0 && <p>You rated this movie {userRating} star{userRating !== 1 ? 's' : ''}</p>}
        </div>

        {/* Review Section */}
        <div className="review-section">
          <h3>Write a Review</h3>
          <form onSubmit={handleReviewSubmit}>
            <textarea
              value={userReview}
              onChange={(e) => setUserReview(e.target.value)}
              placeholder="Share your thoughts about this movie..."
              rows="4"
            />
            <button type="submit" className="review-submit-btn">Submit Review</button>
          </form>
        </div>

        {/* Reviews Display */}
        {reviews.length > 0 && (
          <div className="reviews-section">
            <h3>User Reviews ({reviews.length})</h3>
            {reviews.map((review) => (
              <div key={review.id} className="review-item">
                <div className="review-header">
                  <div className="review-rating">
                    {"⭐".repeat(review.rating)}
                  </div>
                  <span className="review-date">{review.date}</span>
                </div>
                <p className="review-text">{review.text}</p>
              </div>
            ))}
          </div>
        )}

      </div>

    </div>
  );
}

export default MovieDetails;