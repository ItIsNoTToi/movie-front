import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { blob } from 'stream/consumers';

interface FormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const RegisterPage: React.FC = () => {

    const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full Name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords don't match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear the error on change for that field
    setErrors(prev => ({ ...prev, [e.target.name]: undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(false);
    if (validate()) {
      setSubmitted(true);
      // Here you could send data to backend or API
      console.log('Form submitted:', formData);
    }
  };

  return (
    <div style={{ display: 'block', justifyContent: 'center', alignItems: 'center', width: '100%',}}>
        <div style={styles.container}>
        <form style={styles.form} onSubmit={handleSubmit} noValidate>
            <h2 style={styles.title}>Register</h2>

            <label style={styles.label} htmlFor="fullName">Full Name</label>
            <input
            style={{ ...styles.input, borderColor: errors.fullName ? '#f44336' : '#ccc' }}
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Your full name"
            />
            {errors.fullName && <p style={styles.error}>{errors.fullName}</p>}

            <label style={styles.label} htmlFor="email">Email</label>
            <input
            style={{ ...styles.input, borderColor: errors.email ? '#f44336' : '#ccc' }}
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            />
            {errors.email && <p style={styles.error}>{errors.email}</p>}

            <label style={styles.label} htmlFor="password">Password</label>
            <input
            style={{ ...styles.input, borderColor: errors.password ? '#f44336' : '#ccc' }}
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="At least 6 characters"
            autoComplete="new-password"
            />
            {errors.password && <p style={styles.error}>{errors.password}</p>}

            <label style={styles.label} htmlFor="confirmPassword">Confirm Password</label>
            <input
            style={{ ...styles.input, borderColor: errors.confirmPassword ? '#f44336' : '#ccc' }}
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Re-enter your password"
            autoComplete="new-password"
            />
            {errors.confirmPassword && <p style={styles.error}>{errors.confirmPassword}</p>}

            <button type="submit" style={styles.button}>Register</button>

            {submitted && <p style={styles.success}>Registration successful!</p>}
            </form>
            
        </div>
        <button style={{width: '50%',
                        padding: '12px',
                        fontSize: 18,
                        fontWeight: 'bold',
                        color: '#fff',
                        backgroundColor: '#2f89fc',
                        border: 'none',
                        borderRadius: 8,
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'background-color 0.3s',
                        }} onClick={() => navigate('/login')}>
            Sign in
        </button>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f7fa',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: 20,
    width: '100%',
  },
  form: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 12,
    boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: 400,
    boxSizing: 'border-box',
  },
  title: {
    marginBottom: 30,
    fontWeight: 'bold',
    fontSize: 26,
    textAlign: 'center',
    color: '#2f89fc',
  },
  label: {
    display: 'block',
    marginBottom: 6,
    fontWeight: 600,
    color: '#333',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    fontSize: 16,
    borderRadius: 6,
    border: '1.5px solid #ccc',
    marginBottom: 15,
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.3s',
  },
  error: {
    color: '#f44336',
    marginTop: -12,
    marginBottom: 12,
    fontSize: 13,
  },
  button: {
    width: '100%',
    padding: '12px',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: '#2f89fc',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    margin: '5px 0%',
  },
  success: {
    marginTop: 20,
    color: '#4caf50',
    fontWeight: '600',
    textAlign: 'center',
  },
};

export default RegisterPage;
