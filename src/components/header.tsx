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
      <nav className="nav">
        <Link to="/" className="logo">Siêu Nhân</Link>
        <div>
          <div className="menu-item">
            <Link to="/">Trang chủ</Link>
            <Link to="/about">Giới thiệu</Link>
            <ul className="dropdown">
              <li><Link className="dropdown-item" to="/searchAll">Tìm kiếm</Link></li>
              <li><Link className="dropdown-item" to="/List-movie">Danh sach phim</Link></li>
              <li><Link className="dropdown-item" to="/top-movie">Phim hay</Link></li>
            </ul>
          </div>
          
          
          {user ? (
            <Link to="/profile">Xin chào, {user.username}</Link>
          ) : (
            <Link to="/login">Đăng nhập</Link>
          )}
        </div>
        
      </nav>
      </header>
    );
  };

export default Header;
