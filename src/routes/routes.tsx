// src/routes.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/home";
import Watch from "../pages/watch";
import MovieDetail from "../pages/movieDetail";
import LoginPage from "../pages/login";
import ProfilePage from "../pages/profile";
import Dashboard from "../pages/Admin/dashboard";
import RequireAdmin from "../middlewares/RequireAdmin";
import NotFoundPage from "../pages/Error";
import RegisterPage from "../pages/register";


const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/movie/:id" element={<MovieDetail />} />
    <Route path="/movie/:id/:episode" element={<Watch />} />
    
    <Route path="/profile" element={<ProfilePage />} />
    <Route path="/9710010910511011297103101" element={<RequireAdmin />}>
      <Route index element={<Dashboard />} />
    </Route>  
    <Route path="*" element={<NotFoundPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
  </Routes>
);

export default AppRoutes;
