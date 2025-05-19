import axios from "../axiosConfig";
import { Movie } from "../types/movie";

export type MovieResponse = {
  movies: Movie[];
  user: any | null;  // bạn có thể define kiểu user nếu muốn
};

export const fetchMovies = async (): Promise<MovieResponse> => {
  const res = await axios.get('/movie');
  //console.log(res.data)
  return res.data;
};
