import axios from "axios";
import { Movie } from "../types/movie";

export const fetchMovies = async (): Promise<Movie[]> => {
  const res = await axios.get("https://restful-api-vercel-ol4o.vercel.app/movie");
  return res.data;
};
