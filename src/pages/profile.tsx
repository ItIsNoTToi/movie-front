import React, { useEffect, useState } from 'react';
import axios from "../axiosConfig"; 
import AdminPage from './Admin/dashboard';
import { useNavigate } from 'react-router-dom';

const ProfilePage: React.FC = () => {

  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [saveMessage, setSaveMessage] = useState('');

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.toLowerCase());
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setSaveMessage('');
    setNameError('');
    setEmailError('');
  };

  const handleSave = () => {
    let valid = true;
    if (name.trim() === '') {
      setNameError('Name cannot be empty');
      valid = false;
    } else {
      setNameError('');
    }
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      valid = false;
    } else {
      setEmailError('');
    }
    if (valid) {
      setIsEditing(false);
      setSaveMessage('Profile updated successfully!');
    } else {
      setSaveMessage('');
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`/profile`);
        const user = res.data.user;
        // console.log(user); // hoặc set state
        const role = res.data.userrole;
        setRole(role);
        setName(user.username);
        setEmail(user.email)
      } catch (error) {
        console.error("Lỗi khi lấy profile:", error);
      }
    };

    fetchProfile();
  }, []);

  const Logout = async () => {
      try {
          await axios.post('/logout');
          // localStorage.removeItem('user'); // nếu bạn lưu user ở localStorage
          localStorage.removeItem('token'); 
          window.location.href = '/login'; // chuyển hướng về trang đăng nhập
      } catch (error) {
          console.error('Logout failed:', error);
      }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Profile</h2>
        <div style={styles.avatarContainer}>
          <img
            src="https://i.pravatar.cc/120"
            alt="Avatar"
            style={styles.avatar}
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Name</label>
          {isEditing ? (
            <>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ ...styles.input, borderColor: nameError ? '#e74c3c' : '#ccc' }}
              />
              {nameError && <div style={styles.error}>{nameError}</div>}
            </>
          ) : (
            <p style={styles.text}>{name}</p>
          )}
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Email</label>
          {isEditing ? (
            <>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ ...styles.input, borderColor: emailError ? '#e74c3c' : '#ccc' }}
              />
              {emailError && <div style={styles.error}>{emailError}</div>}
            </>
          ) : (
            <p style={styles.text}>{email}</p>
          )}
        </div>

        <div style={styles.buttonContainer}>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              {isEditing ? (
              <>
                <button onClick={handleSave} style={styles.saveButton}>
                  Save
                </button>
                <button onClick={handleEditToggle} style={styles.cancelButton}>
                  Cancel
                </button>
              </>
            ) : (
              <button onClick={handleEditToggle} style={styles.editButton}>
                Edit Profile
              </button>
            )}

            <button onClick={() => navigate('/WATCH-HISTORY')} style={styles.editButton}>
              Watch Hisory
            </button>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginTop: '10px', }}>
            <button onClick={Logout} style={styles.editButton}>
              Log out
            </button>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginTop: '10px', }}>
            {
              role == 'Admin' ?
              (
                <button onClick={()=> navigate('/9710010910511011297103101')} style={styles.editButton}>
                  Admin Page
                </button>
              )
              : ('')
            }
          </div>
        </div>
        {saveMessage && <div style={styles.success}>{saveMessage}</div>}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    height: '100vh',
    background: 'linear-gradient(135deg, #6E8EFb, #A777E3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: '1rem',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: '2rem 3rem',
    boxShadow: '0 16px 32px rgba(0,0,0,0.25)',
    maxWidth: 420,
    width: '100%',
    boxSizing: 'border-box',
    textAlign: 'center',
  },
  title: {
    marginBottom: 24,
    fontWeight: 700,
    fontSize: '2rem',
    color: '#333',
  },
  avatarContainer: {
    marginBottom: 24,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: '50%',
    objectFit: 'cover',
    boxShadow: '0 8px 15px rgba(0,0,0,0.2)',
  },
  field: {
    marginBottom: 20,
    textAlign: 'left',
  },
  label: {
    display: 'block',
    marginBottom: 6,
    fontWeight: 600,
    color: '#555',
    fontSize: '1rem',
  },
  input: {
    width: '100%',
    padding: '0.6rem 1rem',
    borderRadius: 8,
    border: '1.5px solid #ccc',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.3s ease',
    boxSizing: 'border-box',
  },
  text: {
    fontSize: '1.1rem',
    color: '#222',
    marginTop: 2,
  },
  buttonContainer: {
    display: 'block',
    justifyContent: 'center',
    gap: '20px',
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#6E8EFb',
    color: '#fff',
    border: 'none',
    padding: '0.75rem 2rem',
    borderRadius: 12,
    fontWeight: 600,
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  saveButton: {
    backgroundColor: '#27ae60',
    color: '#fff',
    border: 'none',
    padding: '0.75rem 2rem',
    borderRadius: 12,
    fontWeight: 600,
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  cancelButton: {
    backgroundColor: '#e74c3c',
    color: '#fff',
    border: 'none',
    padding: '0.75rem 2rem',
    borderRadius: 12,
    fontWeight: 600,
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  error: {
    color: '#e74c3c',
    fontSize: '0.875rem',
    marginTop: 4,
  },
  success: {
    marginTop: 16,
    color: '#27ae60',
    fontWeight: '600',
    fontSize: '1rem',
  },
};

export default ProfilePage;

