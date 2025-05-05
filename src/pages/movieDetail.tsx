import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import { listenerCount } from "process";

type EpisodeType = {
  id: number;
  title: string;
  description: string;
  episodeNumber: number;
  videoUrl: string;
  releaseDate: string;
  // Thêm các trường khác nếu có
};

type MovieDetailType = {
  id: number;
  title: string;
  description: string;
  releaseDate: string;
  posterUrl: string;
  episodes: EpisodeType[]; // Danh sách các episode
};

const MovieDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [listEpisode, setlistEpisode] = useState<EpisodeType[]>([]);
  const [movie, setMovie] = useState<MovieDetailType | null>(null);

  useEffect(() => {
    if (id) {
      axios
        .get(`https://restful-api-vercel-ol4o.vercel.app/movie/?id=${id}`)
        .then((res) => setMovie(res.data[0]))
        .catch((err) => console.error(err));
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      axios
        .get(`https://restful-api-vercel-ol4o.vercel.app/episode/?MovieId=${id}`)
        
        .then((res) => setlistEpisode(res.data))
        .catch((err) => console.error(err));
    }
  }, [id]);

  if (!movie) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">{movie.title}</h1>
      <img src={movie.posterUrl} alt={movie.title} className="w-full h-auto mt-4" />
      <p>{movie.description}</p>
      <p>Release Date: {movie.releaseDate}</p>

      {/* Hiển thị các episode */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold">Episodes:</h2>
        <ul className="list-disc pl-6">
        {listEpisode.map((episode) => (
            <li key={episode.id}>
              <Link to={`/movie/${movie.id}/${episode.id}`} className="text-md font-bold" >
                {episode.title}
              </Link>
              {/* <p>{episode.description}</p>
              <p>Episode {episode.episodeNumber}</p>
              <p>Release Date: {episode.releaseDate}</p> */}
              
              {/* <a href={episode.videoUrl} target="_blank" rel="noopener noreferrer">
                Watch Episode
              </a> */}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MovieDetail;
