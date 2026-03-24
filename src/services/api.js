// For security and to avoid hitting rate limits, use your own OMDB API key.
// Create a .env file at the project root with VITE_OMDB_KEY=yourkey
const API_KEY = import.meta.env.VITE_OMDB_KEY || "972e65c8";
const BASE_URL = "https://www.omdbapi.com/";

export const searchMovies = async (query, page = 1) => {
  const response = await fetch(`${BASE_URL}?s=${query}&type=movie&page=${page}&apikey=${API_KEY}`);
  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`OMDB API error: ${response.status} ${response.statusText} - ${errText}`);
  }
  const data = await response.json();

  if (data.Response === "False") {
    throw new Error(data.Error || "Unknown API error");
  }

  if (!data.Search) return [];

  // Fetch full details for each movie to get complete poster URLs
  const moviesWithDetails = await Promise.all(
    data.Search.map(async (movie) => {
      try {
        const detailResponse = await fetch(`${BASE_URL}?i=${movie.imdbID}&apikey=${API_KEY}`);
        if (!detailResponse.ok) {
          return movie;
        }
        const details = await detailResponse.json();
        return {
          ...movie,
          Poster: details.Poster || movie.Poster,
          Plot: details.Plot || movie.Plot,
          imdbRating: details.imdbRating || "N/A",
          Genre: details.Genre || "N/A",
          Runtime: details.Runtime || "N/A"
        };
      } catch (error) {
        return movie;
      }
    })
  );

  return {
    movies: moviesWithDetails,
    totalResults: parseInt(data.totalResults) || 0,
    hasMore: page * 10 < parseInt(data.totalResults || 0)
  };
};

export const getMovieDetails = async (imdbID) => {
  const response = await fetch(`${BASE_URL}?i=${imdbID}&apikey=${API_KEY}`);
  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`OMDB API error: ${response.status} ${response.statusText} - ${errText}`);
  }
  const data = await response.json();
  if (data.Response === "False") {
    throw new Error(data.Error || "Movie not found");
  }
  return data;
};