export interface Movie {
  id: string;
  title: string;
  description: string;
  posterUrl: string;
  director?: string;
  duration?: number
  language?: string;
  videoUrl: string;
  rating: number;
  isActive: boolean;
  releaseDate: string;
  genres: Genre[];
}
  

export interface Genre {
  id: number;
  name: string; // Ví dụ: 'Action', 'Comedy'
  movies?: Movie[];
}

export interface Episode {
    id: number;
    title: string;
    description?: string;
    episodeNumber: number;
    videoUrl: string;
    releaseDate?: Date;
    views: number;
    subtitlesUrl?: string;
    quality?: string;
    movie: Movie;
  }