import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchEpisodes, addEpisode, updateEpisode, deleteEpisode } from '../../services/episodeService';
import { Episode } from '../../types/episodes';
import { v4 as uuidv4 } from 'uuid';

type FormData = Omit<Episode, 'id' | 'views' | 'releaseDate'> & { releaseDate: string };

const AdminEpisodeManagementPage: React.FC = () => {
//   const { movieId } = useParams<{ movieId: string }>();
//   const [episodes, setEpisodes] = useState<Episode[]>([]);
//   const [isEditing, setIsEditing] = useState(false);
//   const [editingEpisode, setEditingEpisode] = useState<Episode | null>(null);

//   const getTodayString = () => new Date().toISOString().slice(0, 10);
//   const [formData, setFormData] = useState<FormData>({
//     title: '',
//     description: '',
//     episodeNumber: 1,
//     videoUrl: '',
//     releaseDate: getTodayString(),
//     subtitlesUrl: '',
//     quality: '720p',
//   });
//   const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

//   useEffect(() => {
//     if (movieId) {
//       fetchEpisodes(movieId)
//         .then(data => setEpisodes(data.episodes))
//         .catch(console.error);
//     }
//   }, [movieId]);

//   const resetForm = () => {
//     setFormData({
//       title: '',
//       description: '',
//       episodeNumber: 1,
//       videoUrl: '',
//       releaseDate: getTodayString(),
//       subtitlesUrl: '',
//       quality: '720p',
//     });
//     setFormErrors({});
//     setEditingEpisode(null);
//     setIsEditing(false);
//   };

//   const validateForm = () => {
//     const errors: { [key: string]: string } = {};
//     if (!formData.title.trim()) errors.title = 'Title is required';
//     if (!formData.description.trim()) errors.description = 'Description is required';
//     if (!formData.videoUrl.trim()) errors.videoUrl = 'Video URL is required';
//     if (!formData.releaseDate.trim()) errors.releaseDate = 'Release Date is required';
//     setFormErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: name === 'episodeNumber' ? Number(value) : value,
//     } as any));
//     setFormErrors(prev => ({ ...prev, [name]: '' }));
//   };

//   const handleAddClick = () => {
//     resetForm();
//     setIsEditing(true);
//   };

//   const handleEditClick = (ep: Episode) => {
//     setEditingEpisode(ep);
//     setFormData({
//       title: ep.title,
//       description: ep.description,
//       episodeNumber: ep.episodeNumber,
//       videoUrl: ep.videoUrl,
//       releaseDate: ep.releaseDate.toISOString().slice(0, 10),
//       subtitlesUrl: ep.subtitlesUrl,
//       quality: ep.quality,
//     });
//     setIsEditing(true);
//   };

//   const handleDeleteClick = (id: number) => {
//     if (window.confirm('Bạn có chắc chắn muốn xóa tập phim này?')) {
//       deleteEpisode(movieId!, id)
//         .then(() => setEpisodes(prev => prev.filter(e => e.id !== id)))
//         .catch(console.error);
//     }
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!validateForm()) return;

//     const epData: Episode = {
//       id: editingEpisode ? editingEpisode.id : Number(uuidv4()),
//       title: formData.title,
//       description: formData.description,
//       episodeNumber: formData.episodeNumber,
//       videoUrl: formData.videoUrl,
//       releaseDate: new Date(formData.releaseDate),
//       subtitlesUrl: formData.subtitlesUrl,
//       quality: formData.quality,
//       views: editingEpisode ? editingEpisode.views : 0,
//     };

//     const action = editingEpisode ? updateEpisode : addEpisode;
//     action(movieId!, epData)
//       .then(response => {
//         setEpisodes(prev => editingEpisode
//           ? prev.map(e => e.id === epData.id ? epData : e)
//           : [...prev, epData]
//         );
//       })
//       .catch(console.error)
//       .finally(resetForm);
//   };

  return (
    <div style={styles.container}>
      {/* <h1 style={styles.header}>Quản lý tập phim</h1>
      <button style={styles.addButton} onClick={handleAddClick}>+ Thêm Tập</button>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Tập số</th>
            <th style={styles.th}>Tiêu đề</th>
            <th style={styles.th}>Ngày phát hành</th>
            <th style={styles.th}>Views</th>
            <th style={styles.th}>Chất lượng</th>
            <th style={styles.th}>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {episodes.map(ep => (
            <tr key={ep.id}>
              <td style={styles.td}>{ep.episodeNumber}</td>
              <td style={styles.td}>{ep.title}</td>
              <td style={styles.td}>{ep.releaseDate.toISOString().slice(0, 10)}</td>
              <td style={styles.td}>{ep.views}</td>
              <td style={styles.td}>{ep.quality}</td>
              <td style={styles.td}>
                <button style={styles.editButton} onClick={() => handleEditClick(ep)}>Edit</button>
                <button style={styles.deleteButton} onClick={() => handleDeleteClick(ep.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isEditing && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h2 style={styles.modalTitle}>{editingEpisode ? 'Chỉnh sửa tập' : 'Thêm tập mới'}</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
              <label style={styles.label}>Tập số</label>
              <input type="number" name="episodeNumber" value={formData.episodeNumber}
                onChange={handleInputChange} style={styles.input} min={1} />
              {formErrors.episodeNumber && <span style={styles.error}>{formErrors.episodeNumber}</span>}

              <label style={styles.label}>Tiêu đề</label>
              <input type="text" name="title" value={formData.title}
                onChange={handleInputChange} style={styles.input} autoFocus />
              {formErrors.title && <span style={styles.error}>{formErrors.title}</span>}

              <label style={styles.label}>Mô tả</label>
              <textarea name="description" value={formData.description}
                onChange={handleInputChange} style={styles.textarea}></textarea>
              {formErrors.description && <span style={styles.error}>{formErrors.description}</span>}

              <label style={styles.label}>Video URL</label>
              <input type="text" name="videoUrl" value={formData.videoUrl}
                onChange={handleInputChange} style={styles.input} />
              {formErrors.videoUrl && <span style={styles.error}>{formErrors.videoUrl}</span>}

              <label style={styles.label}>Release Date</label>
              <input type="date" name="releaseDate" value={formData.releaseDate}
                onChange={handleInputChange} style={styles.input} />
              {formErrors.releaseDate && <span style={styles.error}>{formErrors.releaseDate}</span>}

              <label style={styles.label}>Subtitles URL</label>
              <input type="text" name="subtitlesUrl" value={formData.subtitlesUrl}
                onChange={handleInputChange} style={styles.input} />

              <label style={styles.label}>Quality</label>
              <select name="quality" value={formData.quality}
                onChange={handleInputChange as any} style={styles.input}>
                {['480p','720p','1080p'].map(q => <option key={q} value={q}>{q}</option>)}
              </select>

              <div style={styles.formButtons}>
                <button type="submit" style={styles.saveButton}>Save</button>
                <button type="button" style={styles.cancelButton} onClick={resetForm}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )} */}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: { maxWidth: 960, margin: '40px auto', padding: '0 20px' },
  header: { textAlign: 'center', fontSize: '2rem', color: '#2f89fc', marginBottom: 20 },
  addButton: { marginBottom: 20, backgroundColor: '#2f89fc', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 6, cursor: 'pointer' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '12px', borderBottom: '2px solid #ddd', backgroundColor: '#f5f7fb', textAlign: 'left' },
  td: { padding: '12px', borderBottom: '1px solid #eee' },
  editButton: { marginRight: 10, backgroundColor: '#3498db', color: '#fff', border: 'none', padding: '6px 12px', cursor: 'pointer' },
  deleteButton: { backgroundColor: '#e74c3c', color: '#fff', border: 'none', padding: '6px 12px', cursor: 'pointer' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  modal: { backgroundColor: '#fff', padding: 20, borderRadius: 8, width: '90%', maxWidth: 500 },
  textarea: { marginBottom: 16, padding: '8px 12px', fontSize: 16, borderRadius: 4, border: '1px solid #ccc', outline: 'none', minHeight: 80 },
  formButtons: { display: 'flex', justifyContent: 'flex-end', gap: 10 },
  saveButton: { backgroundColor: '#2f89fc', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 6, cursor: 'pointer' },
  cancelButton: { backgroundColor: '#ccc', color: '#333', border: 'none', padding: '10px 20px', borderRadius: 6, cursor: 'pointer' },
  error: { color: '#f44336', marginTop: -12, marginBottom: 12, fontSize: 13 }
};

export default AdminEpisodeManagementPage;