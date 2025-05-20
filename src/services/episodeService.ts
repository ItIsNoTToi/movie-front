import { Episode } from "../types/movie";

export const fetchEpisodes = async (movieId: string) => /* GET /movies/:movieId/episodes */{};
export const addEpisode = async (movieId: string, ep: Episode) => /* POST */{};
export const updateEpisode = async (movieId: string, ep: Episode) => /* PUT */{};
export const deleteEpisode = async (movieId: string, episodeId: number) => /* DELETE */{};
