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
            return
        }
    },[]);

    const validateEmail = (email: string) => {
        // Basic email regex for validation
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
            }); // Gửi cookie

            if (response.status === 200) {
                setSubmitMessage('Login successful!');
                localStorage.setItem("token", JSON.stringify(response.data.token));
                localStorage.setItem("role", JSON.stringify(response.data.role));
                // console.log('Login success:', response.data);
                return window.location.href = '/'; 
                // return navigate('/');
                // return window.location.href = '/login'; 
                // Optional: redirect or set token
            } else {
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
            <h2 style={styles.title}>Login</h2>

            <label htmlFor="email" style={styles.label}>
                Email
            </label>
            <input
                type="email"
                id="email"
                style={{ ...styles.input, borderColor: emailError ? '#e74c3c' : '#ccc' }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
            />
            {emailError && <div style={styles.error}>{emailError}</div>}

            <label htmlFor="password" style={styles.label}>
                Password
            </label>
            <input
                type="password"
                id="password"
                style={{ ...styles.input, borderColor: passwordError ? '#e74c3c' : '#ccc' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                required
            />
            {passwordError && <div style={styles.error}>{passwordError}</div>}

            <button type="submit" style={styles.button}>
                Sign In
            </button>

            {submitMessage && <div style={styles.success}>{submitMessage}</div>}
            </form>

            <button style={styles.button} onClick={() => navigate('/register')}>
                Register
            </button>
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
    },
    form: {
        backgroundColor: '#fff',
        padding: '2.5rem 3rem',
        borderRadius: 12,
        boxShadow: '0 12px 24px rgba(0,0,0,0.2)',
        width: '100%',
        maxWidth: 400,
        boxSizing: 'border-box',
    },
    title: {
        marginBottom: 24,
        fontWeight: 700,
        fontSize: '1.75rem',
        color: '#333',
        textAlign: 'center',
    },
    label: {
        display: 'block',
        marginBottom: 8,
        fontWeight: 600,
        color: '#555',
    },
    input: {
        width: '100%',
        padding: '0.75rem 1rem',
        marginBottom: 16,
        borderRadius: 6,
        border: '1.5px solid #ccc',
        fontSize: '1rem',
        transition: 'border-color 0.3s ease',
        outline: 'none',
    },
    error: {
        color: '#e74c3c',
        fontSize: '0.875rem',
        marginTop: -12,
        marginBottom: 12,
    },
    success: {
        marginTop: 12,
        color: '#27ae60',
        fontWeight: '600',
        textAlign: 'center',
    },
    button: {
        width: '100%',
        padding: '0.75rem 1rem',
        backgroundColor: '#667eea',
        color: 'white',
        border: 'none',
        borderRadius: 6,
        cursor: 'pointer',
        fontWeight: 700,
        fontSize: '1rem',
        transition: 'background-color 0.3s ease',
        margin: '5px 0%',
    },
};

export default LoginPage;

