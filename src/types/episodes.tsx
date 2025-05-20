import { Movie } from "./movie";

export interface Episode {
    id?: number;
    title?: string;
    description?: string;
    episodeNumber?: number;
    videoUrl?: string;
    releaseDate?: Date;
    views?: number;
    subtitlesUrl?: string;
    quality?: string;
    movie?: Movie;
}
  