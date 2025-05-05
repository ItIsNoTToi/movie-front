import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

type Episode = {
  id: number;
  title: string;
  description: string;
  releaseDate: string;
  episodeNumber: number;
  videoUrl: string;
  quality: string;
  views: number;
  subtitlesUrl: string;
};

type MovieDetailType = {
  id: number;
  title: string;
  description: string;
  releaseDate: string;
  posterUrl: string;
  episodes: Episode[];
};

const Watch = () => {
  const { id, episode } = useParams<{ id: string; episode: string }>();
  const [episodeData, setEpisodeData] = useState<Episode | null>(null);
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
    if (id && episode) {
      axios
        .get(`https://restful-api-vercel-ol4o.vercel.app/episode/?MovieId=${id}&id=${episode}`)
        .then((res) => setEpisodeData(res.data[0]))
        .catch((err) => console.error(err));
    }
  }, [id, episode]);

  const getEmbedUrl = (url: string): string => {
    const videoIdMatch = url.match(/(?:\?v=|\/embed\/|\.be\/)([a-zA-Z0-9_-]{11})/);
    return videoIdMatch ? `https://www.youtube.com/embed/${videoIdMatch[1]}` : "";
  };

  if (!episodeData) return <p>Loading...</p>;

  return (
    <div className="p-4 space-y-4">
      <Link to={`/`} className="no-underline">
        Home
      </Link>

      <h1 className="text-2xl font-bold">{episodeData.title}</h1>
      <p className="text-gray-600">{episodeData.description}</p>

      <iframe
        className="w-full max-w-4xl aspect-video"
        src={getEmbedUrl(episodeData.videoUrl)}
        title={episodeData.title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>

      <div className="text-sm text-gray-700 space-y-1">
        <p><strong>Views:</strong> {episodeData.views}</p>
        <p><strong>Quality:</strong> {episodeData.quality}</p>
        <p><strong>Release Date:</strong> {episodeData.releaseDate}</p>
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Episodes</h2>
        <ul className="space-y-1">
        {movie && Array.isArray(movie.episodes) &&
          movie.episodes.map((ep) => {
            const isCurrent = ep.id.toString() === episode;

            return (
              <li key={ep.id}>
                {isCurrent ? (
                  <span className="text-md font-bold text-gray-500 cursor-default">
                    ▶️ {ep.title}
                  </span>
                ) : (
                  <Link
                    to={`/movie/${movie.id}/${ep.id}`}
                    className="text-md font-bold text-blue-600 hover:underline"
                  >
                    ▶️ {ep.title}
                  </Link>
                )}
              </li>
            );
          })}

        </ul>
      </div>
    </div>
  );
};

export default Watch;
