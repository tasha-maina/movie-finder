import { useState, useEffect } from "react";
import { getUserProfiles, switchUser, getCurrentUser, getDataKey } from "../services/user";

function Profile() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [watchlistCount, setWatchlistCount] = useState(0);
  const [ratingsCount, setRatingsCount] = useState(0);
  const [reviewsCount, setReviewsCount] = useState(0);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const updateProfile = () => {
      const profiles = getUserProfiles();
      setUsers(profiles.users);
      const current = getCurrentUser();
      if (current) {
        setName(current);
      }
      updateCounts();
    };

    updateProfile();

    window.addEventListener('userChanged', updateProfile);
    return () => window.removeEventListener('userChanged', updateProfile);
  }, []);

  const updateCounts = () => {
    const favs = JSON.parse(localStorage.getItem(getDataKey("favorites"))) || [];
    const watch = JSON.parse(localStorage.getItem(getDataKey("watchlist"))) || [];
    const ratings = JSON.parse(localStorage.getItem(getDataKey("userRatings"))) || {};
    const reviews = JSON.parse(localStorage.getItem(getDataKey("movieReviews"))) || {};
    setFavoritesCount(favs.length);
    setWatchlistCount(watch.length);
    setRatingsCount(Object.keys(ratings).length);
    setReviewsCount(Object.values(reviews).flat().length);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    switchUser(name.trim());
    setMessage("Profile saved!");
    // refresh user list
    const profiles = getUserProfiles();
    setUsers(profiles.users);
    updateCounts();
  };

  const handleClearData = () => {
    if (
      window.confirm(
        "This will remove your favorites, watchlist, ratings and reviews for the current user. Are you sure?"
      )
    ) {
      localStorage.removeItem(getDataKey("favorites"));
      localStorage.removeItem(getDataKey("watchlist"));
      localStorage.removeItem(getDataKey("userRatings"));
      localStorage.removeItem(getDataKey("movieReviews"));
      updateCounts();
      setMessage("All personal data cleared for user.");
    }
  };

  return (
    <div className="profile-container">
      <h1>👤 Your Profile</h1>

      <form onSubmit={handleSave} className="profile-form">
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
          />
        </label>
        <button type="submit" className="save-profile-btn">
          Save / Switch
        </button>
      </form>
      {users.length > 0 && (
        <div className="user-list">
          <h4>Existing users:</h4>
          {users.map((u) => (
            <button
              key={u}
              className="user-switch-btn"
              onClick={() => {
                switchUser(u);
                setName(u);
                updateCounts();
                setMessage(`Switched to ${u}`);
              }}
            >
              {u}
            </button>
          ))}
        </div>
      )}

      {message && <p className="profile-message">{message}</p>}

      <div className="profile-stats">
        <p>Favorites: {favoritesCount}</p>
        <p>Watchlist: {watchlistCount}</p>
        <p>Movies Rated: {ratingsCount}</p>
        <p>Reviews Written: {reviewsCount}</p>
      </div>

      <button className="clear-data-btn" onClick={handleClearData}>
        Clear All Personal Data
      </button>
    </div>
  );
}

export default Profile;
