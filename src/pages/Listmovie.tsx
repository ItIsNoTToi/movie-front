import { useState, useEffect } from 'react';
import { faSearch, faChevronLeft, faChevronRight, faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fetchMovies } from '../services/movieService';
import { Movie } from '../types/movie';

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    backgroundColor: 'rgba(185, 241, 19, 0.5)',
    color: 'white',
    minHeight: '100vh',
    padding: '1rem',
  } as React.CSSProperties,
  header: {
    marginBottom: '2rem',
  } as React.CSSProperties,
  title: {
    fontSize: '2.25rem',
    fontWeight: 'bold',
    marginBottom: '0.5rem',
  } as React.CSSProperties,
  subtitle: {
    color: 'black',
  } as React.CSSProperties,
  searchInputWrapper: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1.5rem',
    flexWrap: 'wrap',
  } as React.CSSProperties,
  searchInput: {
    flexGrow: 1,
    backgroundColor: '#2d3748',
    borderRadius: '9999px',
    padding: '0.75rem 1.5rem',
    color: 'white',
    border: 'none',
    outline: 'none',
  } as React.CSSProperties,
  button: {
    backgroundColor: '#3182ce',
    color: 'white',
    padding: '0.75rem 1.5rem',
    borderRadius: '9999px',
    border: 'none',
    cursor: 'pointer',
  } as React.CSSProperties,
  filterButtons: {
    display: 'flex',
    gap: '0.5rem',
    overflowX: 'auto',
    paddingBottom: '0.5rem',
    marginBottom: '1.5rem',
  } as React.CSSProperties,
  sectionTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  } as React.CSSProperties,
  sortSelect: {
    backgroundColor: '#2d3748',
    color: 'white',
    borderRadius: '0.25rem',
    padding: '0.5rem 1rem',
    border: 'none',
  } as React.CSSProperties,
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
    gap: '1rem',
  } as React.CSSProperties,
  card: {
    backgroundColor: '#2d3748',
    borderRadius: '0.5rem',
    overflow: 'hidden',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  } as React.CSSProperties,
  poster: {
    width: '100%',
    height: '250px',
    objectFit: 'cover',
  } as React.CSSProperties,
  ratingBadge: {
    position: 'absolute',
    top: '0.5rem',
    right: '0.5rem',
    backgroundColor: '#3182ce',
    color: 'white',
    padding: '0.25rem 0.5rem',
    fontSize: '0.75rem',
    fontWeight: 'bold',
    borderRadius: '0.25rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
  } as React.CSSProperties,
  movieContent: {
    padding: '1rem',
  } as React.CSSProperties,
  movieTitle: {
    fontWeight: '600',
    fontSize: '1.125rem',
    marginBottom: '0.25rem',
  } as React.CSSProperties,
  movieDetails: {
    fontSize: '0.875rem',
    color: '#a0aec0',
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '0.5rem',
  } as React.CSSProperties,
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '2rem',
    gap: '0.5rem',
  } as React.CSSProperties,
  
};

const styleFunctions = {
  filterBtn: (active: boolean): React.CSSProperties => ({
    padding: '0.5rem 1rem',
    borderRadius: '9999px',
    backgroundColor: active ? '#3182ce' : '#2d3748',
    color: active ? 'white' : '#a0aec0',
    border: 'none',
    cursor: 'pointer',
  }),
  watchlistBtn: (inList: boolean): React.CSSProperties => ({
    width: '100%',
    padding: '0.5rem',
    borderRadius: '0.25rem',
    fontSize: '0.875rem',
    cursor: 'pointer',
    color: 'white',
    backgroundColor: inList ? '#38a169' : '#4a5568',
    border: 'none',
  }),
  paginationBtn: (active: boolean): React.CSSProperties => ({
    padding: '0.5rem 1rem',
    borderRadius: '0.25rem',
    backgroundColor: active ? '#3182ce' : '#2d3748',
    color: active ? 'white' : '#a0aec0',
    border: 'none',
    cursor: 'pointer',
  }),
};


const LISTMOVIE = () => {
  const [movies, setMovie] = useState<Movie[]>([]);

  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [currentPage, setCurrentPage] = useState(1);
  const moviesPerPage = 10;
  const [watchlist, setWatchlist] = useState<number[]>([]);

  const filterOptions = [
    { id: 'all', label: 'All Movies' },
    { id: 'trending', label: 'Trending' },
    { id: 'recommended', label: 'Recommended' },
    { id: 'action', label: 'Action' },
    { id: 'comedy', label: 'Comedy' },
    { id: 'drama', label: 'Drama' },
    { id: 'horror', label: 'Horror' },
    { id: 'scifi', label: 'Sci-Fi' },
  ];

  const sortOptions = [
    { value: 'latest', label: 'Latest' },
    { value: 'top-rated', label: 'Top Rated' },
    { value: 'a-z', label: 'A-Z' },
    { value: 'year', label: 'Release Year' },
  ];

  const filteredMovies = movies.filter(movie => {
    const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase());
    let matchesFilter = true;
    if (activeFilter === 'trending') matchesFilter = !!(movie as any).isTrending;
    if (activeFilter === 'recommended') matchesFilter = !!(movie as any).isRecommended;
    if (['action', 'comedy', 'drama', 'horror', 'scifi'].includes(activeFilter)) {
      matchesFilter = movie.genres.some(g => g.name.toLowerCase() === activeFilter);
    }
    return matchesSearch && matchesFilter;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'latest': return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
      case 'top-rated': return b.rating - a.rating;
      case 'a-z': return a.title.localeCompare(b.title);
      case 'year': return new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime();
      default: return Number(b.id) - Number(a.id); // id là string nên cần ép sang số
    }
  });

  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = filteredMovies.slice(indexOfFirstMovie, indexOfLastMovie);
  const totalPages = Math.ceil(filteredMovies.length / moviesPerPage);

  const toggleWatchlist = (movieId: number) => {
    setWatchlist(prev =>
      prev.includes(movieId) ? prev.filter(id => id !== movieId) : [...prev, movieId]
    );
  };

  useEffect(() => {
      fetchMovies()
        .then(data => {
          setMovie(data.movies);
        })
        .catch(console.error);
    }, []);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>KAMEN RIDER HUB</h1>
        <p style={styles.subtitle}>Discover your next favorite superhero movie</p>
      </div>

      <div style={styles.searchInputWrapper}>
        <input
          type="text"
          placeholder="Search for movies..."
          style={styles.searchInput}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button style={styles.button}>
          <FontAwesomeIcon icon={faSearch} />
        </button>
      </div>

      <div style={styles.filterButtons}>
        {filterOptions.map(option => (
          <button
            key={option.id}
            style={styleFunctions.filterBtn(activeFilter === option.id)}
            onClick={() => setActiveFilter(option.id)}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div style={styles.sectionTop}>
        <h2>
          {activeFilter === 'all' ? 'All Movies' :
            activeFilter === 'trending' ? 'Trending Movies' :
              activeFilter === 'recommended' ? 'Recommended' :
                `${activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)} Movies`}
        </h2>
        <select
          style={styles.sortSelect}
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          {sortOptions.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>

      {currentMovies.length > 0 ? (
        <div style={styles.grid}>
          {currentMovies.map(movie => (
            <div key={movie.id} style={styles.card}>
              <div style={{ position: 'relative' }}>
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  style={styles.poster}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x450?text=No+Poster';
                  }}
                />
                <div style={styles.ratingBadge}>
                  <FontAwesomeIcon icon={faStar} size="xs" />
                  <span>{movie.rating.toFixed(1)}</span>
                </div>
              </div>
              <div style={styles.movieContent}>
                <h3 style={styles.movieTitle}>{movie.title}</h3>
                <div style={styles.movieDetails}>
                  <span>{new Date(movie.releaseDate).getFullYear()}</span>
                  <span>{movie.genres.map(g => g.name).join(', ')}</span>
                </div>
                <button
                  style={styleFunctions.watchlistBtn(watchlist.includes(Number(movie.id)))}
                  onClick={() => toggleWatchlist(Number(movie.id))}
                >
                  {watchlist.includes(Number(movie.id)) ? '✓ In Watchlist' : '+ Watchlist'}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ textAlign: 'center', padding: '3rem', color: '#a0aec0' }}>
          No movies found matching your criteria.
        </p>
      )}

      {filteredMovies.length > moviesPerPage && (
        <div style={styles.pagination}>
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            style={styleFunctions.paginationBtn(false)}
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              style={styleFunctions.paginationBtn(currentPage === i + 1)}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            style={styleFunctions.paginationBtn(false)}
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
      )}
    </div>
  );
};

export default LISTMOVIE;
