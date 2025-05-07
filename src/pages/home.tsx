import { useEffect, useState } from "react";
import { Movie } from "../types/movie";
import { fetchMovies } from "../services/movieService";
import { Link } from "react-router-dom";
import './home.css'

const Home = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [genreFilter, setGenreFilter] = useState("All");

  const genres = ["All", "Action", "Drama", "Comedy", "Horror"];
  const hotKeywords = ["Avengers", "Fast & Furious", "Oppenheimer", "Marvel"];

  useEffect(() => {
    fetchMovies().then(setMovies);
  }, []);

  const filteredMovies = movies.filter((movie) => {
    const matchesSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = genreFilter === "All" || movie.genre.includes(genreFilter);
    return matchesSearch && matchesGenre;
  });

  // const hotMovies = movies.slice(0, 5); // Top 5 phim hot làm ví dụ

  return (
    <div className="home-container">
      <div className="search-filter">
        <input
          type="text"
          className="input"
          placeholder="Tìm kiếm phim..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="select"
          value={genreFilter}
          onChange={(e) => setGenreFilter(e.target.value)}
        >
          {genres.map((genre) => (
            <option key={genre}>{genre}</option>
          ))}
        </select>
      </div>

      <div>
        <h2>Tìm kiếm nổi bật</h2>
        <div className="hot-keywords">
          {hotKeywords.map((keyword) => (
            <button key={keyword} onClick={() => setSearchTerm(keyword)}>
              {keyword}
            </button>
          ))}
        </div>
      </div>

      <h2>Danh sách phim</h2>
      <div className="movie-grid">
        {filteredMovies.map((movie) => (
          <Link to={`/movie/${movie.id}`} style={{textDecoration: 'none', }}>
            <div key={movie.id} className="movie-card">
              <img src={movie.posterUrl} alt={movie.title} />
              <h2 className="movie-title">{movie.title}</h2>
              <p>{movie.genre}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
