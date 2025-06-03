import { Movie } from './../types/movie';
import axios from "../axiosConfig";
import { Episode } from "../types/movie";

export const fetchEpisodes = async (movieId: string) => /* GET /movies/:movieId/episodes */{};
export const AddEpisode = async (data: any, movieId: any) =>{
    const res = await axios.post('/9710010910511011297103101/createEpisode',{
        data: data,
        movieId: movieId,
    });
    return res.data;
};
export const updateEpisode = async (movieId: string, ep: Episode) => /* PUT */{};
export const deleteEpisode = async (epId: string, movieId: number) =>{
    const res = await axios.delete(`/9710010910511011297103101/deleteEpisode/${movieId}/${epId}`);
    return res.data;
};

export function convertToMySQLDate(dateStr: string): string {
  const date = new Date(dateStr); // nếu dateStr là "14-May-1990"
  const iso = date.toISOString(); // "1990-05-14T00:00:00.000Z"
  return iso.split('T')[0];       // "1990-05-14"
}
