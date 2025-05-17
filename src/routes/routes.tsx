// src/routes.tsx
import { Routes, Route } from "react-router-dom";
import Home from "../pages/home";
import Watch from "../pages/watch";
import MovieDetail from "../pages/movieDetail";
import LoginPage from "../pages/login";
import ProfilePage from "../pages/profile";

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/movie/:id" element={<MovieDetail />} />
    <Route path="/movie/:id/:episode" element={<Watch />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/profile" element={<ProfilePage />} />
  </Routes>
);

export default AppRoutes;
