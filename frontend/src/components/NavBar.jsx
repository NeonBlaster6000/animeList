import { Link } from "react-router-dom";
import "../css/NavBar.css";
import { isLoggedIn, logoutUser } from "../api/auth"; 
import { useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();
    const loggedIn = isLoggedIn();

    const handleLogout = () => {
        logoutUser();
        navigate("/login");
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/">Anime</Link>
            </div>
            <div className="nav-link">
                <Link to="/" className="nav-link">Home</Link>
                {loggedIn && (
                    <Link to="/favorites" className="nav-link">Favorites</Link>
                )}
                {!loggedIn ? (
                    <Link to="/login" className="nav-link">Login</Link>
                ) : (
                    <button onClick={handleLogout} className="nav-link logout-button">
                        Logout
                    </button>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
