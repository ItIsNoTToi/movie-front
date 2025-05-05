import { useEffect, useState } from "react";
import { Movie } from "../types/movie";
import { fetchMovies } from "../services/movieService";
import { Link } from "react-router-dom";

const Home = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    fetchMovies().then(setMovies);
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
      {movies.map(movie => (
        <div key={movie.id}>
          <img src={movie.posterUrl} alt={movie.title} />
          <h2 className="text-lg">{movie.title}</h2>
          <Link to={`/movie/${movie.id}`} className="text-blue-500">
            Xem chi tiết
          </Link>
        </div>
      ))}
    </div>
  );
};

export default Home;
