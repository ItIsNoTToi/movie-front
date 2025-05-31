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

export const AddMovie = async (data: Partial<Movie>): Promise<MovieResponse> => {
  const res = await axios.post('/9710010910511011297103101/createMovie', { 
    title: data.title,
    description: data.description,
    releaseDate: data.releaseDate,
    director: data.director,
    duration: data.duration,
    language: data.language,
    posterUrl: data.posterUrl,
    rating: data.rating,
    isActive: data.isActive,
    genres: data.genres, // nếu có
    hashtags: data.hashtags,
  });
  return res.data;
};


export const DeleteMovie = async (id: any): Promise<MovieResponse> => {
  const res = await axios.delete(`/9710010910511011297103101/deleteMovie/${id}`);
  return res.data;
};
