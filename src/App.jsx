import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import SearchBar from "./components/SearchBar";
import MovieCard from "./components/MovieCard";
import MovieDetails from "./pages/MovieDetails";
import Favorites from "./pages/Favorites";
import Watchlist from "./pages/Watchlist";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";
import FeaturedBanner from "./components/FeaturedBanner";
import LoadingSkeleton from "./components/LoadingSkeleton";
import SearchFilters from "./components/SearchFilters";
import CategoryCarousel from "./components/CategoryCarousel";
import Recommendations from "./components/Recommendations";

import { searchMovies } from "./services/api";

import "./App.css";

function App() {
  // theme handling
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved || "dark";
  });

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.body.classList.remove("dark-theme", "light-theme");
    document.body.classList.add(`${next}-theme`);
  };

  // initialize body class once
  useEffect(() => {
    document.body.classList.add(`${theme}-theme`);
  }, []);

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [currentQuery, setCurrentQuery] = useState("Avatar");
  const [sortBy, setSortBy] = useState("title");
  const [sortOrder, setSortOrder] = useState("asc");
  const [errorMessage, setErrorMessage] = useState("");

  // Category data
  const [categories, setCategories] = useState({
    action: { movies: [], loading: false },
    comedy: { movies: [], loading: false },
    drama: { movies: [], loading: false },
    horror: { movies: [], loading: false }
  });

  useEffect(() => {
    fetchMovies("Avatar", 1, true);
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const categoryQueries = {
      action: "action hero",
      comedy: "comedy",
      drama: "drama",
      horror: "horror"
    };

    Object.entries(categoryQueries).forEach(async ([category, query]) => {
      setCategories(prev => ({ ...prev, [category]: { ...prev[category], loading: true } }));

      try {
        const result = await searchMovies(query, 1);
        const filteredMovies = result.movies.slice(0, 10); // Limit to 10 per category

        setCategories(prev => ({
          ...prev,
          [category]: { movies: filteredMovies, loading: false }
        }));
      } catch (error) {
        console.error(`Error loading ${category} movies:`, error);
        setCategories(prev => ({ ...prev, [category]: { movies: [], loading: false } }));
      }
    });
  };

  const sortMovies = (moviesToSort) => {
    return [...moviesToSort].sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case "year":
          aValue = parseInt(a.Year) || 0;
          bValue = parseInt(b.Year) || 0;
          break;
        case "rating":
          aValue = parseFloat(a.imdbRating) || 0;
          bValue = parseFloat(b.imdbRating) || 0;
          break;
        case "title":
        default:
          aValue = a.Title.toLowerCase();
          bValue = b.Title.toLowerCase();
          break;
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
    });
  };

  const fetchMovies = async (query, page = 1, reset = false) => {
    if (loading) return;

    setLoading(true);

    try {
      const result = await searchMovies(query, page);

      if (reset) {
        setMovies(sortMovies(result.movies));
        setCurrentQuery(query);
        setCurrentPage(1);
      } else {
        setMovies(prev => sortMovies([...prev, ...result.movies]));
      }

      setHasMore(result.hasMore);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching movies:", error);
      setErrorMessage(error.message || "Failed to fetch movies");
    }

    setLoading(false);
  };

  const handleSortChange = (newSortBy, newSortOrder) => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    setMovies(prev => sortMovies(prev));
  };

  const loadMoreMovies = () => {
    if (hasMore && !loading) {
      fetchMovies(currentQuery, currentPage + 1);
    }
  };

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop
        >= document.documentElement.offsetHeight - 1000
      ) {
        loadMoreMovies();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, loading, currentPage, currentQuery]);

  const handleSearch = (query) => {
    fetchMovies(query, 1, true);
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="app-container">
            <Navbar theme={theme} toggleTheme={toggleTheme} />

            <h1>🎬 Movie Finder</h1>

            <h2 id="trending" className="trending-title">🔥 Trending</h2>

            {movies.length > 0 && !loading && <FeaturedBanner movie={movies[0]} />}
            {errorMessage && (
              <div className="api-error">
                <p>Error: {errorMessage}</p>
              </div>
            )}

            <div id="search">
              <SearchBar onSearch={handleSearch} />
            </div>

            {movies.length > 0 && (
              <SearchFilters onSortChange={handleSortChange} />
            )}

            {loading && movies.length === 0 && (
              <div className="movie-grid">
                {Array.from({ length: 10 }, (_, i) => (
                  <LoadingSkeleton key={i} />
                ))}
              </div>
            )}

            {movies.length > 0 && (
              <>
                <div className="movie-grid">
                  {movies.map((movie) => (
                    <MovieCard
                      key={movie.imdbID}
                      movie={movie}
                    />
                  ))}
                </div>

                {loading && (
                  <div className="loading-more">
                    <div className="loading-spinner"></div>
                    <p>Loading more movies...</p>
                  </div>
                )}

                {!hasMore && movies.length > 0 && (
                  <div className="end-message">
                    <p>🎬 You've reached the end! No more movies to load.</p>
                  </div>
                )}
              </>
            )}

            {!loading && movies.length === 0 && (
              <p style={{textAlign: "center", color: "#aaa", fontSize: "18px", marginTop: "40px"}}>
                No movies found. Try searching for something else! 🍿
              </p>
            )}

            {/* Category Carousels */}
            <CategoryCarousel
              title="🎬 Action Heroes"
              movies={categories.action.movies}
              loading={categories.action.loading}
            />

            <CategoryCarousel
              title="😂 Comedy"
              movies={categories.comedy.movies}
              loading={categories.comedy.loading}
            />

            <CategoryCarousel
              title="🎭 Drama"
              movies={categories.drama.movies}
              loading={categories.drama.loading}
            />

            <CategoryCarousel
              title="👻 Horror"
              movies={categories.horror.movies}
              loading={categories.horror.loading}
            />

            {/* Recommendations Section */}
            <Recommendations />
          </div>
        }
      />

      <Route
        path="/movie/:id"
        element={<MovieDetails />}
      />

      <Route
        path="/favorites"
        element={
          <div>
            <Navbar theme={theme} toggleTheme={toggleTheme} />
            <Favorites />
          </div>
        }
      />

      <Route
        path="/watchlist"
        element={
          <div>
            <Navbar theme={theme} toggleTheme={toggleTheme} />
            <Watchlist />
          </div>
        }
      />

      <Route
        path="/profile"
        element={
          <div>
            <Navbar theme={theme} toggleTheme={toggleTheme} />
            <Profile />
          </div>
        }
      />
    </Routes>
  );
}

export default App;
