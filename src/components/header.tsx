// components/Header.tsx
import { Link } from "react-router-dom";
import "./header.css"; 

const Header = () => {
    return (
      <header className="header">
        <Link to="/" className="logo">Movie App</Link>
        <nav>
          <Link to="/">Trang chủ</Link>
          <Link to="/about">Giới thiệu</Link>
          <Link to="/login">Đăng nhập</Link>
        </nav>
      </header>
    );
  };

export default Header;
