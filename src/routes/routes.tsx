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
import AdminMovieManagementPage from "../pages/Admin/movie_dashboard";
import SearchAll from "../pages/searchAll";
import AdminCategoriesManagementPage from "../pages/Admin/categories_dashboard";
import LISTMOVIE from "../pages/Listmovie";

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/movie/:id" element={<MovieDetail />} />
    <Route path="/movie/:id/:episode" element={<Watch />} />
    <Route path="/profile" element={<ProfilePage />} />
    <Route path="/searchAll" element={<SearchAll />} />
    <Route path="/List-movie" element={<LISTMOVIE/>} />
    <Route path="/top-movie" element={<></>} />
    {/* Render các route quản trị */}
    {AdminRoutes()}
    {/* Route đăng nhập/đăng ký */}
    {AccountRoutes()}
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);


export const AdminRoutes = () => (
  <Route path="/9710010910511011297103101" element={<RequireAdmin />}>
    <Route index element={<Dashboard />} />
    <Route path="categories" element={<AdminCategoriesManagementPage />} />
    <Route path="movies" element={<AdminMovieManagementPage />} />
  </Route>
);

export const AccountRoutes = () => (
  <>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
  </>
);


export default AppRoutes;
