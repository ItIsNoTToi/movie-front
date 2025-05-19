import React from 'react';

const NotFoundPage: React.FC = () => {
  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.title}>404</h1>
        <p style={styles.message}>Oops! The page you're looking for doesn't exist.</p>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f7fa',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: '#333',
  },
  content: {
    textAlign: 'center',
    padding: 40,
    backgroundColor: '#fff',
    borderRadius: 12,
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    maxWidth: 400,
    width: '90%',
  },
  title: {
    fontSize: 96,
    fontWeight: 'bold',
    margin: 0,
    color: '#2f89fc',
  },
  message: {
    fontSize: 18,
    marginTop: 20,
  },
};

export default NotFoundPage;

