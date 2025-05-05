// src/routes.tsx
import { Routes, Route } from "react-router-dom";
import Home from "../pages/home";
import Watch from "../pages/watch";
import MovieDetail from "../pages/movieDetail";

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/movie/:id" element={<MovieDetail />} />
    <Route path="/movie/:id/:episode" element={<Watch />} />
  </Routes>
);

export default AppRoutes;
