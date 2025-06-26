import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "../axiosConfig";
import './watch.css';

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

// type MovieDetailType = {
//   id: number;
//   title: string;
//   description: string;
//   releaseDate: string;
//   posterUrl: string;
//   episodes: Episode[];
// };

const Watch = () => {
  const { id, episode } = useParams<{ id: string; episode: string }>();
  const [episodeData, setEpisodeData] = useState<Episode | null>(null);
  const [listEpisode, setlistEpisode] = useState<Episode[]>([]);
  // const [movie, setMovie] = useState<MovieDetailType | null>(null);

  // useEffect(() => {
  //   if (id) {
  //     axios
  //       .get(`https://restful-api-vercel-ol4o.vercel.app/movie/?id=${id}`)
        
  //       .then((res) => setMovie(res.data[0]))
  //       .catch((err) => console.error(err));
  //   }
  // }, [id]);
  useEffect(() => {
    if (id) {
      axios
        .get(`/movie/${id}`)
        .then((res) => {
          const listE = res.data.movie.episodes;
          // console.log(listE);
          setlistEpisode(listE);
        })
        .catch((err) => console.error(err));
    }
  }, [id]);

  useEffect(() => {
    if (id && episode) {
      axios
        .get(`/movie/${id}/${episode}`)
        .then((res) => {
          const Episode = res.data.episode;
          // console.log(Episode);
          setEpisodeData(Episode);
        })
        .catch((err) => console.error(err));
    }
  }, [id, episode]);

  const getEmbedUrl = (url: string): string => {
    const videoIdMatch = url.match(/(?:\?v=|\/embed\/|\.be\/)([a-zA-Z0-9_-]{11})/);
    return videoIdMatch ? `https://www.youtube.com/embed/${videoIdMatch[1]}` : "";
  };

  if (!episodeData) return <p>Loading...</p>
  // else console.log(episodeData);

  return (
    <div className="container">
      <h1 className="title">{episodeData.title}</h1>
      <p className="description">{episodeData.description}</p>
      <iframe
        className="video-iframe"
        src={getEmbedUrl(episodeData.videoUrl)}
        title={episodeData.title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
      <div className="details">
        <p><strong>Views:</strong> {episodeData.views}</p>
        <p><strong>Quality:</strong> {episodeData.quality}</p>
        <p><strong>Release Date:</strong> {episodeData.releaseDate}</p>
      </div>

      <div className="episode-list">
        <h2 className="text-lg font-semibold mb-2">Episodes</h2>
        <ul style={{ listStyle: 'none',}}>
          {listEpisode.map((ep) => {
            const isCurrent = ep.id.toString() === episode;
            return (
              <li key={ep.id} className="episode-item">
                {isCurrent ? (
                  <span className="current-episode">
                    ▶️ {ep.title}
                  </span>
                ) : (
                  <Link
                    to={`/movie/${id}/${ep.episodeNumber}`}
                    className="episode-link"
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
