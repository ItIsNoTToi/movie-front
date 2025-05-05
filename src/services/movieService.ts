import axios from "axios";
import { Movie } from "../types/movie";

export const fetchMovies = async (): Promise<Movie[]> => {
  const res = await axios.get("http://192.168.100.4:3000/movie");
  return res.data;
};
