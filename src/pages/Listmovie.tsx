import React, { useState } from 'react';

const sampleData = [
  {
    id: 1,
    name: 'React Basics',
    category: 'Programming',
    hashtags: ['#react', '#javascript', '#frontend'],
    releaseDate: '2022-01-15',
    author: 'John Doe',
  },
  {
    id: 2,
    name: 'Advanced React Patterns',
    category: 'Programming',
    hashtags: ['#react', '#patterns'],
    releaseDate: '2023-03-10',
    author: 'Jane Smith',
  },
  {
    id: 3,
    name: 'Cooking Tips',
    category: 'Lifestyle',
    hashtags: ['#cooking', '#food', '#tips'],
    releaseDate: '2021-11-25',
    author: 'Chef Alex',
  },
  {
    id: 4,
    name: 'Photography 101',
    category: 'Art',
    hashtags: ['#photography', '#art'],
    releaseDate: '2022-05-05',
    author: 'Emily Clark',
  },
  {
    id: 5,
    name: 'React Hooks Deep Dive',
    category: 'Programming',
    hashtags: ['#react', '#hooks', '#javascript'],
    releaseDate: '2024-05-20',
    author: 'Mark Antonio',
  },
];

const categories = ['All', 'Programming', 'Lifestyle', 'Art'];

const SearchAll: React.FC  = () => {
  const [filters, setFilters] = useState({
    category: 'All',
    hashtag: '',
    name: '',
    releaseDate: '',
    author: '',
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const filterItems = () => {
    return sampleData.filter((item) => {
      // Category filter
      if (filters.category !== 'All' && item.category !== filters.category) {
        return false;
      }
      // Hashtag filter (case-insensitive, match any hashtag includes the search)
      if (
        filters.hashtag &&
        !item.hashtags.some((tag) =>
          tag.toLowerCase().includes(filters.hashtag.toLowerCase())
        )
      ) {
        return false;
      }
      // Name filter (case-insensitive substring)
      if (
        filters.name &&
        !item.name.toLowerCase().includes(filters.name.toLowerCase())
      ) {
        return false;
      }
      // Release date filter (YYYY-MM-DD)
      if (filters.releaseDate && item.releaseDate !== filters.releaseDate) {
        return false;
      }
      // Author filter (case-insensitive substring)
      if (
        filters.author &&
        !item.author.toLowerCase().includes(filters.author.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  };

  const filteredItems = filterItems();

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Search All</h1>
      <div style={styles.filterBox}>
        <div style={styles.filterGroup}>
          <label htmlFor="category" style={styles.label}>
            Category
          </label>
          <select
            id="category"
            name="category"
            value={filters.category}
            onChange={handleChange}
            style={styles.select}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
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
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <div key={item.id} style={styles.card}>
              <h3 style={styles.itemName}>{item.name}</h3>
              <p><strong>Category:</strong> {item.category}</p>
              <p><strong>Hashtags:</strong> {item.hashtags.join(' ')}</p>
              <p><strong>Release Date:</strong> {item.releaseDate}</p>
              <p><strong>Author:</strong> {item.author}</p>
            </div>
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
    maxWidth: '900px',
    margin: '40px auto',
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

