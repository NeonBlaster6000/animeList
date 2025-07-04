import React from "react";
import "../css/AnimeCard.css";

function FavoriteCard({ anime, onRemove }) {
  function onInfo(e) {
    e.preventDefault();
    alert(anime.synopsis);
  }

  function onLike(e) {
    e.stopPropagation(); 
    if (onRemove) {
      
      onRemove(anime.mal_id); 
      
    }
  }

  return (
    <div className="anime-card" onClick={onInfo}>
      <div className="anime-poster">
        <img src={anime.images.jpg.image_url} alt={anime.title} />
        <div className="anime-overlay">
          <button className="favorite-btn" onClick={onLike}>
            ❤️
          </button>
        </div>
      </div>
      <div className="anime-info">
        <h3>{anime.title}</h3>
        <p>⭐ {anime.score ?? "N/A"}</p>
      </div>
    </div>
  );
}

export default FavoriteCard;
