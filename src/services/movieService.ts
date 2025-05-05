import axios from "axios";
import { Movie } from "../types/movie";

export const fetchMovies = async (): Promise<Movie[]> => {
  const res = await axios.get("http://localhost:3000/movie");
  return res.data;
};
