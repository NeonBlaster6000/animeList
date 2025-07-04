import "../css/AnimeCard.css";
import { isLoggedIn,  addFavorite } from "../api/auth";

function AnimeCard({ anime }) {
    async function onLike(e) {
        e.preventDefault();
        e.stopPropagation();

        if (!isLoggedIn()) {
            alert("Please login to like anime");
            return;
        }

        try {
            const result = await addFavorite( String(anime.mal_id), anime.title); // adjust ID if needed
            alert("Added to favorites!");
        } catch (err) {
            alert("Error: " + JSON.stringify(err.message));
        }
    }

    function onInfo(e) {
        e.preventDefault();
        alert(anime.synopsis);
    }

    return (
        <div className="anime-card" onClick={onInfo}>
            <div className="anime-poster">
                <img src={anime.images.jpg.image_url} alt={anime.title} />
                <div className="anime-overlay">
                    <button className="favorite-btn" onClick={onLike}>
                        🤍
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

export default AnimeCard;
