import "./css/App.css";
import Favorites from "./pages/Favorites";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/NavBar";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <div>
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/favorites" element={
            <PrivateRoute>
              <Favorites />
            </PrivateRoute>
            } />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;