import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import axios from '../axiosConfig';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
    const { isLoggedIn } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [submitMessage, setSubmitMessage] = useState('');

    useEffect(() => {
        if (isLoggedIn) {
            navigate('/profile');
            return;
        }
    }, [isLoggedIn, navigate]);

    const validateEmail = (email: string) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email.toLowerCase());
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        let valid = true;

        if (!validateEmail(email)) {
            setEmailError('Please enter a valid email address');
            valid = false;
        } else {
            setEmailError('');
        }

        if (password.trim() === '') {
            setPasswordError('Please enter your password');
            valid = false;
        } else {
            setPasswordError('');
        }

        if (!valid) {
            setSubmitMessage('');
            return;
        }

        try {
            const response = await axios.post('/login', {
                email,
                password,
            });

            if (response.status === 200) {
              setSubmitMessage('Login successful!');
              localStorage.setItem("token", JSON.stringify(response.data.token));
              localStorage.setItem("role", JSON.stringify(response.data.role));
              localStorage.setItem("user", JSON.stringify(response.data.user));
              // navigate('/'); 
              window.location.href = '/';
            } else if (response.status === 403) {
              alert('Your account is not activated. Please check your email for the activation link.');
              setSubmitMessage('Your account is not activated. Please check your email for the activation link.');
            } else{
              alert('Login failed. Please try again.');
              setSubmitMessage('Login failed. Please try again.');
            }
        } catch (error: any) {
            setSubmitMessage(error.response?.data?.message || 'Login failed. Please check your credentials.');
            console.error('Login error:', error);
        }
    };

    return (
    <div style={styles.container}>
      <form style={styles.form} onSubmit={handleSubmit} noValidate>
        <h2 style={styles.title}>Sign In</h2>

        <label htmlFor="email" style={styles.label}>Email</label>
        <input
          type="email"
          id="email"
          style={{ ...styles.input, borderColor: emailError ? '#e74c3c' : '#ccc' }}
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="you@example.com"
        />
        {emailError && <div style={styles.error}>{emailError}</div>}

        <label htmlFor="password" style={styles.label}>Password</label>
        <input
          type="password"
          id="password"
          style={{ ...styles.input, borderColor: passwordError ? '#e74c3c' : '#ccc' }}
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Enter your password"
        />
        {passwordError && <div style={styles.error}>{passwordError}</div>}

        <button type="submit" style={styles.loginButton}>Login</button>

        {submitMessage && <div style={styles.success}>{submitMessage}</div>}

        <div style={styles.registerSection}>
          <span style={styles.registerText}>Don't have an account?</span>
          <button
            type="button"
            style={styles.registerButton}
            onClick={() => navigate('/register')}
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: '0 20px',
  },
  form: {
    backgroundColor: '#fff',
    padding: '3rem 2.5rem',
    borderRadius: 12,
    boxShadow: '0 15px 30px rgba(0,0,0,0.2)',
    width: '100%',
    maxWidth: 400,
    boxSizing: 'border-box',
    textAlign: 'center',
  },
  title: {
    marginBottom: 30,
    fontSize: '1.9rem',
    fontWeight: '700',
    color: '#333',
  },
  label: {
    display: 'block',
    textAlign: 'left',
    marginBottom: 8,
    fontWeight: 600,
    color: '#555',
  },
  input: {
    width: '100%',
    padding: '12px 15px',
    marginBottom: 20,
    borderRadius: 8,
    border: '1.8px solid #ccc',
    fontSize: 16,
    outline: 'none',
    transition: 'border-color 0.3s ease',
  },
  error: {
    textAlign: 'left',
    marginTop: -14,
    marginBottom: 16,
    color: '#e74c3c',
    fontSize: 14,
  },
  loginButton: {
    width: '100%',
    padding: '14px 0',
    fontWeight: '700',
    fontSize: 18,
    color: '#fff',
    backgroundColor: '#667eea',
    border: 'none',
    borderRadius: 10,
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  success: {
    marginTop: 16,
    color: '#27ae60',
    fontWeight: 600,
    fontSize: 16,
  },
  registerSection: {
    marginTop: 30,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  registerText: {
    color: '#555',
    fontSize: 15,
  },
  registerButton: {
    color: '#667eea',
    border: '2px solid #667eea',
    padding: '8px 20px',
    fontWeight: 600,
    borderRadius: 8,
    cursor: 'pointer',
    backgroundColor: 'transparent',
    fontSize: 15,
    transition: 'all 0.3s ease',
  },
};

export default LoginPage;

