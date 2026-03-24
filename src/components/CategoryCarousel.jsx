import { useState, useRef } from "react";
import MovieCard from "./MovieCard";

function CategoryCarousel({ title, movies, loading }) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
      setTimeout(checkScrollButtons, 300);
    }
  };

  return (
    <div className="category-section">
      <h2 className="category-title">{title}</h2>

      <div className="carousel-container">
        {canScrollLeft && (
          <button
            className="scroll-btn scroll-left"
            onClick={() => scroll('left')}
          >
            ‹
          </button>
        )}

        <div
          className="carousel"
          ref={scrollRef}
          onScroll={checkScrollButtons}
        >
          {loading ? (
            Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="carousel-item">
                <div className="loading-skeleton">
                  <div className="skeleton-image"></div>
                  <div className="skeleton-text"></div>
                  <div className="skeleton-text short"></div>
                </div>
              </div>
            ))
          ) : (
            movies.map((movie) => (
              <div key={movie.imdbID} className="carousel-item">
                <MovieCard movie={movie} />
              </div>
            ))
          )}
        </div>

        {canScrollRight && (
          <button
            className="scroll-btn scroll-right"
            onClick={() => scroll('right')}
          >
            ›
          </button>
        )}
      </div>
    </div>
  );
}

export default CategoryCarousel;