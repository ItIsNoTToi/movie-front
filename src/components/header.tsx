// components/Header.tsx
import { Link } from "react-router-dom";
import "./header.css"; 
import { useEffect, useState } from "react";
import { Movie } from "../types/movie";
import { fetchMovies } from "../services/movieService";

interface User {
  id: number;
  username: string;
  email: string;
  // các trường user khác nếu có
}

const Header = () => {

  const [user, setUser] = useState<User | null>(null);
  
  
    useEffect(() => {
      fetchMovies()
        .then(data => {
          setUser(data.user);
        })
        .catch(console.error);
    }, []);

    return (
      <header className="header">
        <Link to="/" className="logo">Movie App</Link>
        <nav>
        <Link to="/">Trang chủ</Link>
        <Link to="/about">Giới thiệu</Link>
        
        {user ? (
          <Link to="/profile">Xin chào, {user.username}</Link>
        ) : (
          <Link to="/login">Đăng nhập</Link>
        )}
      </nav>
      </header>
    );
  };

export default Header;
