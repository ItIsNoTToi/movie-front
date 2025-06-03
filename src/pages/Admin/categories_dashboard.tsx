import React, { useState, useEffect } from 'react';
import { Genre } from '../../types/movie';
import { fetchGenres } from '../../services/genreservices';

const AdminCategoriesManagementPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingGenree, setEditingGenre] = useState<Genre | null>(null);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [categoriename, setCategoriesName] = useState('');
  const [genres, setgenres] = useState<Genre[] | null>(null);  

  // Filtered movies by search
  const filteredGenre = genres?.filter(m =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() =>{
    fetchGenres()
    .then(data => {
      // console.log(data.data);
      setgenres(data.data);
    })
    .catch(err => console.error(err));
  },[]);

  const resetForm = () => {
    setCategoriesName('');
    setFormErrors({});
    setEditingGenre(null);
    setIsEditing(false);
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!categoriename || categoriename.length === 0){
        errors.genre = 'Genres are required';
    }
        
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddClick = () => {
    // resetForm();
    setIsEditing(true);
  };

    const handleEditClick = (genre: Genre) => {
        setEditingGenre(genre);
        setCategoriesName(genre.name); // <-- Gán tên danh mục vào input
        setIsEditing(true);
    };

//   const handleDeleteClick = (id: Number) => {
//     if (window.confirm('Bạn có chắc chắn muốn xóa phim này?')) {
//     //   DeleteMovie(id).then(res => {
//     //     setMovies(prev => prev?.filter(m => m.id !== id) || null);
//     //   })
//     //   .catch(err => {
//     //     console.log(err);
//     //   })
//     }
//   };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
    //   if (editingMovie) {
    //     // Update movie local
    //     setMovies(prev => prev?.map(m => m.id === editingMovie.id ? movieData : m) || null);
    //   } else {
    //     // Add movie
    //     //console.log(movieData);
    //     setMovies(prev => prev ? [...prev, movieData] : [movieData]);
    //     AddMovie(movieData).then(data => {
    //       console.log(data);
    //     })
        
    //   }
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
          + Add Categories
        </button>
      </div>

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Danh muc</th>
              <th style={styles.th}></th>
            </tr>
          </thead>
          <tbody>
            {filteredGenre?.length === 0 ? (
              <tr>
                <td colSpan={7} style={styles.noMovies}>
                  No genres found.
                </td>
              </tr>
            ) : (
              filteredGenre?.map(genre => (
                <tr key={genre.id} onClick={(e) => {}}>
                    <td style={styles.td}>{genre.name}</td>
                    <td style={styles.td}>
                        <button style={styles.editButton} onClick={() => handleEditClick(genre)}>
                        Edit
                        </button>
                        {/* <button style={styles.deleteButton} onClick={() => handleDeleteClick(genre.id)}>
                        Delete
                        </button> */}
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
            <h2 style={styles.modalTitle}>{editingGenree ? 'Edit Movie' : 'Add Categories'}</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
              <label style={styles.label}>Category Name</label>
              <input
                type="text"
                name="name"
                value={categoriename}
                onChange={(e) => {
                  setCategoriesName(e.target.value);
                }}
                style={{ ...styles.input, borderColor: formErrors.title ? '#f44336' : '#ccc' }}
                autoFocus
              />
              {formErrors.genre && <span style={styles.error}>{formErrors.genre}</span>}

              <div style={styles.formButtons}>
                <button type="submit" style={styles.saveButton}>
                  {editingGenree ? 'Save Changes' : 'Add Categories'}
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

export default AdminCategoriesManagementPage;
