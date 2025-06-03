import React, { useState, useEffect } from 'react';
import { AddMovie, DeleteMovie, fetchMovies } from '../../services/movieService';
import { Genre, Hashtag, Movie } from '../../types/movie';
import { v4 as uuidv4 } from 'uuid';
import { json } from 'stream/consumers';
import { fetchGenres } from '../../services/genreservices';
import Select from 'react-select';

const AdminMovieManagementPage: React.FC = () => {
  const [movies, setMovies] = useState<Movie[] | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [title, settitle] = useState('');
  const [description, setdescription] = useState('');
  const [posterUrl, setposterUrl] = useState('');
  const [director, setdirector] = useState('');
  const [duration, setduration] = useState(0);
  const [language, setlanguage] = useState('');
  const [videoUrl, setvideoUrl] = useState('');
  const [rating, setrating] = useState(0);
  const [isActive, setisActive] = useState(true);
  const [releaseDate, setreleaseDate] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<string[] | null>(null);
  const [genres, setgenres] = useState<Genre[] | null>(null);  
  const [hashtag, setHashtag] = useState<string | null>('');
  const [hashtagInput, setHashtagInput] = useState("");
  const [selectedHashtag, setselectedHashtag] = useState<string[] | null>(null);
  const [hashtags, setHashtags] = useState<Hashtag[]>([]);

  // Filtered movies by search
  const filteredMovies = movies?.filter(m =>
    m.title.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const handleAddHashtag = (/*e: React.FormEvent*/) => {
    // e.preventDefault();

    const trimmedInput = hashtagInput.trim();
    if (trimmedInput === "") {
      setFormErrors({ hashtag: "Hashtag không được để trống" });
      return;
    }

    const newTag = { name: trimmedInput };

    // Nếu hashtags có thể null thì cần kiểm tra
    if (hashtags === null) {
      setHashtags([newTag]);
    } else if (!hashtags.some(tag => tag.name === trimmedInput)) {
      setHashtags([...hashtags, newTag]);
    } else {
      setFormErrors({ hashtag: "Hashtag đã tồn tại" });
      return;
    }

    setHashtagInput(""); // reset input
    setFormErrors({ ...formErrors, hashtag: "" }); // xóa lỗi nếu có
  };


  const handleDeleteHashtag = (tagToDelete: any) => {
    setHashtags(prev => prev.filter(tag => tag !== tagToDelete));
  };

  useEffect(() =>{
    fetchGenres()
    .then(data => {
      // console.log(data.data);
      setgenres(data.data);
    })
    .catch(err => console.error(err));
  },[genres]);

  useEffect(() => {
    fetchMovies()
      .then(data => setMovies(data.movies))
      .catch(err => console.error(err));
  }, []);

  const resetForm = () => {
    settitle('');
    setdescription('');
    setdirector('');
    setHashtag('');
    setduration(0);
    setgenres([]);
    setposterUrl('');
    setreleaseDate('');
    setvideoUrl('');
    setFormErrors({});
    setEditingMovie(null);
    setIsEditing(false);
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    // if (!formData.genres || formData.genres.length === 0)
    //   errors.genres = 'Genres are required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
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
      DeleteMovie(id).then(res => {
        setMovies(prev => prev?.filter(m => m.id !== id) || null);
      })
      .catch(err => {
        console.log(err);
      })
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const movieData: Movie = {
      id: editingMovie ? editingMovie.id : uuidv4(),
      title: title,
      description: description,
      releaseDate: releaseDate,
      hashtags: hashtags!,
      director: director,
      duration: duration,
      language: language,
      posterUrl: '',
      rating: 0,
      isActive: isActive,
      genres:  (genres?.filter((genre) => selectedGenres!.includes(genre.id.toString()))) || [],
      videoUrl: "", // nếu có trường này
    };

    try {
      if (editingMovie) {
        // Update movie local
        setMovies(prev => prev?.map(m => m.id === editingMovie.id ? movieData : m) || null);
      } else {
        // Add movie
        //console.log(movieData);
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
                    window.location.href = `/movie/${movie.id}`;
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
                value={title}
                onChange={(e) => {
                  settitle(e.target.value);
                }}
                style={{ ...styles.input, borderColor: formErrors.title ? '#f44336' : '#ccc' }}
                autoFocus
              />
              {formErrors.title && <span style={styles.error}>{formErrors.title}</span>}

              <label style={styles.label}>Director</label>
              <input
                type="text"
                name="director"
                value={director}
                onChange={(e) => {
                  setdirector(e.target.value);
                }}
                style={{ ...styles.input, borderColor: formErrors.director ? '#f44336' : '#ccc' }}
                autoFocus
              />
              {formErrors.director && <span style={styles.error}>{formErrors.director}</span>}

              <label style={styles.label}>Duration</label>
              <input
                type="number"
                name="duration"
                value={duration}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  if (!isNaN(value)) setduration(value);
                }}
                style={{ ...styles.input, borderColor: formErrors.duration ? '#f44336' : '#ccc' }}
                autoFocus
              />
              {formErrors.duration && <span style={styles.error}>{formErrors.duration}</span>}

              <label style={styles.label}>Genres</label>
              <select
                multiple
                value={selectedGenres!}
                onChange={(e) => {
                  const selected = Array.from(e.target.selectedOptions, (option) => option.value);
                  setSelectedGenres(selected);
                }}
              >
                {genres?.map((genre) => (
                  <option key={genre.id} value={genre.id}>
                    {genre.name}
                  </option>
                ))}
              </select>
              {formErrors.genre && <span style={styles.error}>{formErrors.genre}</span>}

              <div>
                <label style={styles.label}>Hash Tag</label>
                <input
                  type="text"
                  name="hashtag"
                  value={hashtagInput}
                  onChange={(e) => {
                    setHashtagInput(e.target.value); // chỉ thay đổi input hiện tại
                  }}
                  style={{
                    padding: '8px',
                    borderColor: formErrors.hashtag ? '#f44336' : '#ccc',
                    borderWidth: 1,
                    borderStyle: 'solid',
                    borderRadius: 4,
                    width: 300,
                    marginRight: 10,
                  }}
                  placeholder="Nhập hashtag rồi nhấn Add"
                />
                <button type="button" onClick={handleAddHashtag}>Add HashTag</button>

                <div style={{ marginTop: 10 }}>
                  <label>Danh sách hashtag đã thêm:</label><br />
                  <select
                    multiple
                    onChange={(e) => {
                      e.preventDefault();
                      const selected = Array.from(e.target.selectedOptions, (option) => option.value);
                      setselectedHashtag(selected);
                    }}
                    style={{ width: 300, height: 100 }}
                  >
                    {hashtags.map(tag => (
                      <option key={tag.name} value={tag.name}>
                        {tag.name}
                      </option>
                    ))}
                  </select>

                  <div style={{ marginTop: 10 }}>
                    {hashtags.map(tag => (
                      <span
                        key={tag.name}
                        style={{
                          display: 'inline-block',
                          marginRight: 8,
                          background: '#eee',
                          padding: '4px 8px',
                          borderRadius: 12,
                        }}
                      >
                        {tag.name}{' '}
                        <button
                          onClick={() => handleDeleteHashtag(tag.name)}
                          style={{
                            border: 'none',
                            background: 'transparent',
                            cursor: 'pointer',
                            color: '#f44336',
                            fontWeight: 'bold'
                          }}
                        >
                          x
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <label style={styles.label}>Release Date</label>
              <input
                type="date"
                name="releaseDate"
                value={releaseDate}
                onChange={(e) => {
                  setreleaseDate(e.target.value);
                }}
                style={{ ...styles.input, borderColor: formErrors.releaseDate ? '#f44336' : '#ccc' }}
              />

              {formErrors.year && <span style={styles.error}>{formErrors.year}</span>}

              <label style={styles.label}>Language</label>
              <input
                type="text"
                name="language"
                value={language}
                onChange={(e) => {
                  setlanguage(e.target.value);
                }}
                style={{ ...styles.input, borderColor: formErrors.language ? '#f44336' : '#ccc' }}
              />
              {formErrors.language && <span style={styles.error}>{formErrors.language}</span>}

              <label style={styles.label}>Description</label>
              <textarea
                name="description"
                value={description}
                onChange={(e) => {
                  setdescription(e.target.value);
                }}
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
    alignItems: 'flex-start',
    zIndex: 1000,
    overflowY: "auto",
    paddingRight: "10px",
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
