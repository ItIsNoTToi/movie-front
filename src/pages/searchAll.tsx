import React, { useEffect, useState } from 'react';
import { fetchGenres } from '../services/genreservices';
import { searchItems } from '../services/movieService';
import { Movie } from '../types/movie';
import { Link } from 'react-router-dom';

interface Genre {
  id: number;
  name: string;
}

const SearchAll: React.FC  = () => {

  const [items, setItems] = useState<Movie[]>([]); // hoặc [] nếu không dùng dữ liệu mẫu
  const [loading, setLoading] = useState(false);
  const [genre, setgenre] = useState<Genre[] | null>(null);

  const [filters, setFilters] = useState({
    category: 'All',
    hashtag: '',
    name: '',
    releaseDate: '',
    author: '',
  });

  const buildFilterPayload = () => {
    return {
      ...(filters.category !== 'All' && { category: filters.category }),
      ...(filters.hashtag.trim() && { hashtag: filters.hashtag }),
      ...(filters.name.trim() && { name: filters.name }),
      ...(filters.releaseDate.trim() && { releaseDate: filters.releaseDate }),
      ...(filters.author.trim() && { author: filters.author }),
    };
  };
  
  const fetchFilteredItems = async () => {
    setLoading(true);
    try {
      const res = await searchItems(buildFilterPayload()); // Gửi toàn bộ filters
      setItems(res.data); // Server trả về danh sách item mới
    } catch (error) {
      console.error('Error fetching filtered items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    fetchGenres()
    .then(data => {
      setgenre(data.data);
    })
  },[]);

  useEffect(() => {
    fetchFilteredItems();
    
  }, [filters]);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Search All</h1>
      <div style={styles.filterBox}>
        <div style={styles.filterGroup}>
          <label htmlFor="genre" style={styles.label}>
            Genres
          </label>
          <select
            id="genre"
            name="genre"
            value={filters.category}
            onChange={handleChange}
            style={styles.select}
          >
            <option value="All">All</option>
            {genre?.map((item) => (
              <option key={item.id} value={item.name}>
                {item.name}
              </option>
            ))}

          </select>

        </div>
        <div style={styles.filterGroup}>
          <label htmlFor="hashtag" style={styles.label}>
            Hashtag
          </label>
          <input
            id="hashtag"
            name="hashtag"
            type="text"
            placeholder="e.g. #react"
            value={filters.hashtag}
            onChange={handleChange}
            style={styles.input}
          />
        </div>
        <div style={styles.filterGroup}>
          <label htmlFor="name" style={styles.label}>
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Item name"
            value={filters.name}
            onChange={handleChange}
            style={styles.input}
          />
        </div>
        <div style={styles.filterGroup}>
          <label htmlFor="releaseDate" style={styles.label}>
            Release Date
          </label>
          <input
            id="releaseDate"
            name="releaseDate"
            type="date"
            value={filters.releaseDate}
            onChange={handleChange}
            style={styles.input}
          />
        </div>
        <div style={styles.filterGroup}>
          <label htmlFor="author" style={styles.label}>
            Author
          </label>
          <input
            id="author"
            name="author"
            type="text"
            placeholder="Author name"
            value={filters.author}
            onChange={handleChange}
            style={styles.input}
          />
        </div>
      </div>

      <div style={styles.results}>
        {loading ? (
          <p>Loading...</p>
        ) : items.length > 0 ? (
          items.map((item) => (
            <Link to={`/movie/${item.id}`} style={{ textDecoration: 'none', }} key={item.id} >
              <div style={styles.card}>
                <h3 style={styles.itemName}>{item.title}</h3>
                <p><strong>Genres:</strong> {Array.isArray(item.genres) ? item.genres.map(g => g.name).join(', ') : 'No genres'}</p>
                <p><strong>Hashtags:</strong> {Array.isArray(item.hashtags) ? item.hashtags.map(h => h.name).join(', ') : 'No hashtags'}</p>
                <p><strong>Release Date:</strong> {item.releaseDate}</p>
                <p><strong>Author:</strong> {item.director}</p>
              </div>
            </Link>
          ))
        ) : (
          <p style={styles.noResults}>No results found.</p>
        )}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    backgroundColor: 'rgba(185, 241, 19, 0.5)',
    maxWidth: '1000px',
    margin: '40px 10%',
    padding: '0 20px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  title: {
    textAlign: 'center',
    fontSize: '2.8rem',
    color: '#222',
    marginBottom: '30px',
  },
  filterBox: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
    marginBottom: '40px',
    backgroundColor: '#f9f9f9',
    padding: '20px',
    borderRadius: '12px',
    boxShadow:
      '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  filterGroup: {
    flex: '1 1 160px',
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginBottom: '8px',
    fontWeight: '600',
    color: '#555',
    fontSize: '1rem',
  },
  input: {
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1.5px solid #ccc',
    fontSize: '1rem',
    outlineColor: '#007bff',
    transition: 'border-color 0.3s',
  },
  select: {
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1.5px solid #ccc',
    fontSize: '1rem',
    outlineColor: '#007bff',
    appearance: 'none',
    backgroundColor: '#fff',
  },
  results: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))',
    gap: '25px',
  },
  card: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '14px',
    boxShadow:
      '0 6px 15px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s ease',
    cursor: 'default',
  },
  itemName: {
    marginTop: 0,
    marginBottom: '10px',
    color: '#007bff',
  },
  noResults: {
    fontSize: '1.2rem',
    color: '#777',
    textAlign: 'center',
  },
};

export default SearchAll;

