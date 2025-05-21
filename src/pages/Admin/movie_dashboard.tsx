import React, { useState, useEffect } from 'react';
import { AddMovie, fetchMovies } from '../../services/movieService';
import { Genre, Movie } from '../../types/movie';
import { v4 as uuidv4 } from 'uuid';
import { json } from 'stream/consumers';

const AdminMovieManagementPage: React.FC = () => {
  const [movies, setMovies] = useState<Movie[] | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    releaseDate: "",
    director: "",
    language: "",
    duration: 0,
    posterUrl: "",
    rating: 0,
    isActive: true,
    genres: [] as Genre[],
  });
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  // Filtered movies by search
  const filteredMovies = movies?.filter(m =>
    m.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchMovies()
      .then(data => setMovies(data.movies))
      .catch(err => console.error(err));
  }, []);

  const resetForm = () => {
    setFormData({ 
      title: "",
      description: "",
      releaseDate: '',
      director: "",
      duration: 0,
      language: "",
      posterUrl: "",
      rating: 0,
      isActive: true,
      genres: [],
    });
    setFormErrors({});
    setEditingMovie(null);
    setIsEditing(false);
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.genres || formData.genres.length === 0)
      errors.genres = 'Genres are required';
    if (!formData.releaseDate.trim()) {
      errors.releaseDate = 'Release date is required';
    }
    if (!formData.rating || isNaN(Number(formData.rating)) || Number(formData.rating) < 0 || Number(formData.rating) > 10)
      errors.rating = 'Rating must be between 0 and 10';
    if (!formData.language.trim()) errors.language = 'Language is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setFormErrors(prev => ({ ...prev, [e.target.name]: '' }));
  };

  const handleAddClick = () => {
    // resetForm();
    setIsEditing(true);
  };

  const handleEditClick = (movie: Movie) => {
    setEditingMovie(movie);
    // setFormData({
    //   title: movie.title,
    //   // genres: movie.genres.map(g => g.name).join(', '),
    //   releaseDate: new Date(movie.releaseDate).getFullYear().toString(),
    //   rating: movie.rating,
    //   language: movie.language || '',
    // });
    setIsEditing(true);
  };

  const handleDeleteClick = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa phim này?')) {
      setMovies(prev => prev?.filter(m => m.id !== id) || null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const movieData: Movie = {
      id: editingMovie ? editingMovie.id : uuidv4(),
      title: formData.title,
      description: formData.description,
      releaseDate: formData.releaseDate,
      director: formData.director,
      duration: formData.duration,
      language: formData.language,
      posterUrl: formData.posterUrl,
      rating: formData.rating,
      isActive: formData.isActive,
      genres: formData.genres,
      videoUrl: "", // nếu có trường này
    };

    try {
      if (editingMovie) {
        // Update movie local
        setMovies(prev => prev?.map(m => m.id === editingMovie.id ? movieData : m) || null);
      } else {
        // Add movie
        setMovies(prev => prev ? [...prev, movieData] : [movieData]);
        AddMovie(movieData).then(data => {
          console.log(data);
        })
        
      }
      resetForm();
    } catch (error) {
      console.error(error);
    }
  };



  return (
    <div style={styles.pageContainer}>
      <h1 style={styles.header}>Movie Management Dashboard</h1>
      <div style={styles.topBar}>
        <input
          type="text"
          placeholder="Search by title..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
        <button style={styles.addButton} onClick={handleAddClick}>
          + Add Movie
        </button>
      </div>

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Tên phim</th>
              <th style={styles.th}>Ngày phát hành</th>
              <th style={styles.th}>Ngôn ngữ</th>
              <th style={styles.th}>Thể loại</th>
              <th style={styles.th}>Rating</th>
              <th style={styles.th}>Trạng thái</th>
              <th style={styles.th}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredMovies?.length === 0 ? (
              <tr>
                <td colSpan={7} style={styles.noMovies}>
                  No movies found.
                </td>
              </tr>
            ) : (
              filteredMovies?.map(movie => (
                <tr key={movie.id} onClick={(e) => {
                if ((e.target as HTMLElement).tagName.toLowerCase() !== 'button') {
                    window.location.href = `/9710010910511011297103101/movies/${movie.id}/episodes`;
                }
                }}>
                    <td style={styles.td}>{movie.title}</td>
                    <td style={styles.td}>{movie.releaseDate}</td>
                    <td style={styles.td}>{movie.language}</td>
                    <td style={styles.td}>{movie.genres.map(g => g.name).join(', ')}</td>
                    <td style={styles.td}>{movie.rating}</td>
                    <td style={styles.td}>
                        <span style={{ color: movie.isActive ? 'green' : 'red' }}>
                        {movie.isActive ? 'Đang hiển thị' : 'Đã ẩn'}
                        </span>
                    </td>
                    <td style={styles.td}>
                        <button style={styles.editButton} onClick={() => handleEditClick(movie)}>
                        Edit
                        </button>
                        <button style={styles.deleteButton} onClick={() => handleDeleteClick(movie.id)}>
                        Delete
                        </button>
                    </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isEditing && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h2 style={styles.modalTitle}>{editingMovie ? 'Edit Movie' : 'Add Movie'}</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
              <label style={styles.label}>Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                style={{ ...styles.input, borderColor: formErrors.title ? '#f44336' : '#ccc' }}
                autoFocus
              />
              {formErrors.title && <span style={styles.error}>{formErrors.title}</span>}

              <label style={styles.label}>Genres (comma separated)</label>
              <input
                type="text"
                placeholder="e.g. Action, Sci-Fi"
                value={formData.genres.map(g => g.name).join(', ')}
                onChange={(e) => {
                  const genreNames = e.target.value.split(',').map(name => name.trim()).filter(Boolean);
                  setFormData(prev => ({
                    ...prev,
                    genres: genreNames.map((name, idx) => ({ id: idx + 1, name })),
                  }));
                  setFormErrors(prev => ({ ...prev, genres: '' }));
                }}
                style={{ ...styles.input, borderColor: formErrors.genres ? '#f44336' : '#ccc' }}
              />
              {formErrors.genres && <span style={styles.error}>{formErrors.genres}</span>}

              <label style={styles.label}>Release Date</label>
              <input
                type="date"
                name="releaseDate"
                value={formData.releaseDate}
                onChange={handleInputChange}
                style={{ ...styles.input, borderColor: formErrors.releaseDate ? '#f44336' : '#ccc' }}
              />

              {formErrors.year && <span style={styles.error}>{formErrors.year}</span>}

              <label style={styles.label}>Rating (0 - 10)</label>
              <input
                type="number"
                name="rating"
                value={formData.rating}
                onChange={handleInputChange}
                style={{ ...styles.input, borderColor: formErrors.rating ? '#f44336' : '#ccc' }}
                min={0}
                max={10}
                step={0.1}
              />
              {formErrors.rating && <span style={styles.error}>{formErrors.rating}</span>}

              <label style={styles.label}>Language</label>
              <input
                type="text"
                name="language"
                value={formData.language}
                onChange={handleInputChange}
                style={{ ...styles.input, borderColor: formErrors.language ? '#f44336' : '#ccc' }}
              />
              {formErrors.language && <span style={styles.error}>{formErrors.language}</span>}

              <label style={styles.label}>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                style={styles.input}
              />


              <div style={styles.formButtons}>
                <button type="submit" style={styles.saveButton}>
                  {editingMovie ? 'Save Changes' : 'Add Movie'}
                </button>
                <button type="button" style={styles.cancelButton} onClick={resetForm}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  pageContainer: {
    maxWidth: 960,
    margin: '40px auto',
    padding: '0 20px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: '#333',
  },
  header: {
    fontSize: '2rem',
    fontWeight: 700,
    marginBottom: 20,
    textAlign: 'center',
    color: '#2f89fc',
  },
  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    padding: '10px 14px',
    fontSize: 16,
    borderRadius: 6,
    border: '1.5px solid #ccc',
    outline: 'none',
    boxSizing: 'border-box',
  },
  addButton: {
    backgroundColor: '#2f89fc',
    color: 'white',
    border: 'none',
    borderRadius: 8,
    fontWeight: 'bold',
    fontSize: 16,
    padding: '10px 20px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  tableContainer: {
    overflowX: 'auto',
    borderRadius: 8,
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    backgroundColor: 'white',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: 16,
  },
  th: {
    padding: '12px 15px',
    borderBottom: '2px solid #ddd',
    textAlign: 'left',
    backgroundColor: '#f5f7fb',
    fontWeight: '600',
    color: '#555',
  },
  td: {
    padding: '12px 15px',
    borderBottom: '1px solid #eee',
  },
  noMovies: {
    padding: 20,
    textAlign: 'center',
    color: '#999',
  },
  editButton: {
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: 6,
    padding: '6px 10px',
    marginRight: 10,
    cursor: 'pointer',
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: 6,
    padding: '6px 10px',
    cursor: 'pointer',
    fontWeight: '600',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 12,
    width: '90%',
    maxWidth: 480,
    boxSizing: 'border-box',
    boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
    position: 'relative',
  },
  modalTitle: {
    marginBottom: 20,
    fontSize: 22,
    fontWeight: '700',
    color: '#2f89fc',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginBottom: 6,
    fontWeight: '600',
    color: '#333',
  },
  input: {
    marginBottom: 15,
    padding: '10px 12px',
    fontSize: 16,
    borderRadius: 6,
    border: '1.5px solid #ccc',
    outline: 'none',
    transition: 'border-color 0.3s',
    boxSizing: 'border-box',
  },
  error: {
    color: '#f44336',
    marginTop: -10,
    marginBottom: 12,
    fontSize: 13,
  },
  formButtons: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 10,
  },
  saveButton: {
    backgroundColor: '#2f89fc',
    color: 'white',
    border: 'none',
    borderRadius: 8,
    padding: '10px 20px',
    fontWeight: '700',
    fontSize: 16,
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  cancelButton: {
    backgroundColor: '#ccc',
    color: '#333',
    border: 'none',
    borderRadius: 8,
    padding: '10px 20px',
    fontWeight: '700',
    fontSize: 16,
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
};

export default AdminMovieManagementPage;
