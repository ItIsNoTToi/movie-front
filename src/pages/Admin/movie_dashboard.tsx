import React, { useState, useEffect } from 'react';

interface Movie {
    id: number;
    title: string;
    genre: string;
    year: number;
    rating: number; // scale of 0-10
}

const initialMovies: Movie[] = [
    { id: 1, title: "Inception", genre: "Sci-Fi", year: 2010, rating: 8.8 },
    { id: 2, title: "The Dark Knight", genre: "Action", year: 2008, rating: 9.0 },
    { id: 3, title: "Interstellar", genre: "Adventure", year: 2014, rating: 8.6 },
];

const AdminMovieManagementPage: React.FC = () => {
    const [movies, setMovies] = useState<Movie[]>(initialMovies);
    const [searchTerm, setSearchTerm] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        genre: '',
        year: '',
        rating: '',
    });
    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

    // Filtered movies by search
    const filteredMovies = movies.filter(m =>
        m.title.toLowerCase().includes(searchTerm.toLowerCase())
        || m.genre.toLowerCase().includes(searchTerm.toLowerCase())
        || m.year.toString().includes(searchTerm)
    );

    const resetForm = () => {
        setFormData({title: '', genre: '', year: '', rating: ''});
        setFormErrors({});
        setEditingMovie(null);
        setIsEditing(false);
    };

    const validateForm = () => {
        const errors: { [key: string]: string } = {};
        if (!formData.title.trim()) errors.title = 'Title is required';
        if (!formData.genre.trim()) errors.genre = 'Genre is required';
        if (!formData.year.trim() || isNaN(Number(formData.year)) || Number(formData.year) < 1888) errors.year = 'Valid year is required (>=1888)';
        if (!formData.rating.trim() || isNaN(Number(formData.rating)) || Number(formData.rating) < 0 || Number(formData.rating) > 10) errors.rating = 'Rating must be between 0 and 10';
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({...formData, [e.target.name]: e.target.value});
        setFormErrors({...formErrors, [e.target.name]: ''});
    };

    const handleAddClick = () => {
        resetForm();
        setIsEditing(true);
    };

    const handleEditClick = (movie: Movie) => {
        setFormData({
            title: movie.title,
            genre: movie.genre,
            year: movie.year.toString(),
            rating: movie.rating.toString(),
        });
        setEditingMovie(movie);
        setIsEditing(true);
    };

    const handleDeleteClick = (movieId: number) => {
        if(window.confirm('Are you sure you want to delete this movie?')){
            setMovies(movies.filter(m => m.id !== movieId));
        }
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!validateForm()) return;

        if(editingMovie){
            // Update
            setMovies(prev => prev.map(m => m.id === editingMovie.id ? {
                ...m,
                title: formData.title.trim(),
                genre: formData.genre.trim(),
                year: Number(formData.year),
                rating: Number(formData.rating)
            } : m));
        } else {
            // Add new
            const newMovie: Movie = {
                id: Date.now(),
                title: formData.title.trim(),
                genre: formData.genre.trim(),
                year: Number(formData.year),
                rating: Number(formData.rating)
            };
            setMovies(prev => [...prev, newMovie]);
        }
        resetForm();
    };

    return (
        <div style={styles.pageContainer}>
            <h1 style={styles.header}>Movie Management Dashboard</h1>
            <div style={styles.topBar}>
                <input
                    type="text"
                    placeholder="Search by title, genre or year..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    style={styles.searchInput}
                />
                <button style={styles.addButton} onClick={handleAddClick}>+ Add Movie</button>
            </div>

            <div style={styles.tableContainer}>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>Title</th>
                            <th style={styles.th}>Genre</th>
                            <th style={styles.th}>Year</th>
                            <th style={styles.th}>Rating</th>
                            <th style={styles.th}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredMovies.length === 0 ? (
                            <tr><td colSpan={5} style={styles.noMovies}>No movies found.</td></tr>
                        ) : (
                            filteredMovies.map(movie => (
                                <tr key={movie.id}>
                                    <td style={styles.td}>{movie.title}</td>
                                    <td style={styles.td}>{movie.genre}</td>
                                    <td style={styles.td}>{movie.year}</td>
                                    <td style={styles.td}>{movie.rating.toFixed(1)}</td>
                                    <td style={styles.td}>
                                        <button style={styles.editButton} onClick={() => handleEditClick(movie)}>Edit</button>
                                        <button style={styles.deleteButton} onClick={() => handleDeleteClick(movie.id)}>Delete</button>
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
                        <form onSubmit={handleFormSubmit} style={styles.form}>
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

                            <label style={styles.label}>Genre</label>
                            <input
                                type="text"
                                name="genre"
                                value={formData.genre}
                                onChange={handleInputChange}
                                style={{ ...styles.input, borderColor: formErrors.genre ? '#f44336' : '#ccc' }}
                            />
                            {formErrors.genre && <span style={styles.error}>{formErrors.genre}</span>}

                            <label style={styles.label}>Year</label>
                            <input
                                type="number"
                                name="year"
                                value={formData.year}
                                onChange={handleInputChange}
                                style={{ ...styles.input, borderColor: formErrors.year ? '#f44336' : '#ccc' }}
                                min={1888}
                                max={new Date().getFullYear() + 5}
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

                            <div style={styles.formButtons}>
                                <button type="submit" style={styles.saveButton}>
                                    {editingMovie ? 'Save Changes' : 'Add Movie'}
                                </button>
                                <button type="button" style={styles.cancelButton} onClick={resetForm}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
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
    }
};

export default AdminMovieManagementPage;

