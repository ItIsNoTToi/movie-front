import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "../axiosConfig";
import './MovieDetail.css';

type EpisodeType = {
  id: number;
  title: string;
  description: string;
  episodeNumber: number;
  videoUrl: string;
  releaseDate: string;
};

type MovieDetailType = {
  id: number;
  title: string;
  description: string;
  releaseDate: string;
  posterUrl: string;
  episodes: EpisodeType[];
};

const MovieDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [listEpisode, setlistEpisode] = useState<EpisodeType[]>([]);
  const [movie, setMovie] = useState<MovieDetailType | null>(null);
  
  useEffect(() => {
    if (id) {
      axios.get(`/movie/${id}`)
        .then(res => {
          const moviedetail = res.data.movie; // lấy đúng key "movie"
          setMovie(moviedetail);
          setlistEpisode(moviedetail.episodes || []);
        })
        .catch(err => console.error(err));}
  }, [id]);

  if (!movie) return <p>Loading...</p>;
  // else console.log(listEpisode);

  return (
    <div className="movie-detail-container" >
      <h1 className="movie-title">{movie.title}</h1>
      <div style={{display: 'flex', justifyContent: 'space-around', padding: 2, }}>
        <div>
          <img src={movie.posterUrl} alt={movie.title} style={{ borderWidth: 10, borderColor: 'red', borderRadius: 12}} />
        </div>
        <div style={{ padding: 10, }}>
          <p className="movie-description">{movie.description}</p>
          <p className="movie-release-date">Release Date: {movie.releaseDate}</p>
        </div>
        <div></div>
      </div>
      
      <div className="episode-list">
        <h2 className="text-lg font-semibold">Episodes:</h2>
        <ul className="episode">
          {listEpisode.map((episode) => (
            <li key={episode.id} className="episode-item">
              <Link to={`/movie/${movie.id}/${episode.id}`} className="episode-title">
                {episode.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MovieDetail;
