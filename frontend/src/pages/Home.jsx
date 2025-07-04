import AnimeCard from "../components/AnimeCard";
import { useEffect, useState } from "react";
import "../css/Home.css";

function Home() {
    const [searchQuery, setSearchQuery] = useState("");
    const [animeList, setAnimeList] = useState([]);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        try {
            const res = await fetch(
                `https://api.jikan.moe/v4/anime?q=${searchQuery}`,
            );
            const data = await res.json();
            setAnimeList(data.data);
        } catch (err) {
            console.error("Error fetching anime:", err);
        }
    };

    useEffect(() => {
        const fetchTopAnime = async () => {
            try {
                const res = await fetch("https://api.jikan.moe/v4/top/anime?limit=20");
                const data = await res.json();
                setAnimeList(data.data)
            } catch (error) {
                console.error("Failed to fetch top anime:", error);
            }
        };
        fetchTopAnime();
    }, []);

    return (
        <div className="home">
            <form onSubmit={handleSearch} className="search-form">
                <input
                    type="text"
                    placeholder="Search for animes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
                    className="search-input"
                />
                <button type="submit" className="search-button">
                    Search
                </button>
            </form>

            <div className="anime-grid">
                {animeList
                    .filter((anime) => 
                        searchQuery ? anime.title?.toLowerCase().includes(searchQuery): true)
                    .map((anime) => (
                        <AnimeCard anime={anime} key={anime.mal_id} />
                    ))}
            </div>
        </div>
    );
}

export default Home;
