import axios from "axios";
import { Movie } from "../types/movie";

export type MovieResponse = {
  movies: Movie[];
  user: any | null;  // bạn có thể define kiểu user nếu muốn
};

export const fetchMovies = async (): Promise<MovieResponse> => {
  const res = await axios.get("http://localhost:3000/movie", {
    withCredentials: true,
  });

  console.log(res.data)
  return res.data;
};
