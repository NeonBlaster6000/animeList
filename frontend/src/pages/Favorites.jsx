import React, { useEffect, useState } from "react";
import FavoriteCard from "../components/FavoriteCard";
import "../css/Favorites.css";
import "../css/App.css";

import { fetchFavorites, removeFavorite } from "../api/auth";

function Favorites() {
  const [animeDetails, setAnimeDetails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getFavorites() {
      const details = await fetchFavorites();

      const uniqueDetails = details.filter(
        (anime, index, self) =>
          index === self.findIndex((a) => a.mal_id === anime.mal_id)
      );

      setAnimeDetails(uniqueDetails);
      setLoading(false);
    }

    getFavorites();
  }, []);

  async function handleRemove(malId) {
    const success = await removeFavorite(malId);
    if (success) {
      setAnimeDetails((prev) =>
        prev.filter((anime) => anime.mal_id !== malId)
      );
    }
  }

  if (loading) return <p>Loading favorites...</p>;

  if (animeDetails.length === 0) {
    return (
      <div className="favorites-empty">
        <h2>No Favorite anime Yet</h2>
        <p>Start adding animes to your list</p>
      </div>
    );
  }

  return (
    <div className="anime-grid">
      {animeDetails.map((anime) => (
        <FavoriteCard
          key={anime.mal_id}
          anime={anime}
          onRemove={handleRemove}
        />
      ))}
    </div>
  );
}

export default Favorites;
