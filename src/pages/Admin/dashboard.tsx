import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getaccount } from '../../services/adminservices';
import { Ban_User } from '../../services/authorizeservices';

interface CardProps {
  title: string;
  value: number | string;
  icon?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, value, icon }) => {
  return (
    <div style={styles.card}>
      <div style={styles.cardIcon}>{icon}</div>
      <div>
        <h3 style={styles.cardTitle}>{title}</h3>
        <p style={styles.cardValue}>{value}</p>
      </div>
    </div>
  );
};

interface User {
  id: number;
  username: string;
  email: string;
  admin: {
    role: string;
  };
  isActived: boolean;
}




const AdminPage: React.FC = () => {
  const navigation = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [ac, setAc] = useState<User>();

  useEffect(() =>{
    getaccount()
    .then(data => setUsers(data.account))
  },[]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setAc(JSON.parse(storedUser));
    }
  }, []);

  const role = JSON.parse(localStorage.getItem("role") || "{}");
  if(role !== 'Admin'){
    return <div>Cut </div>
  }
  else{

  }

  const BanUser = async (id: number) => {
    const confirmed = window.confirm("Are you sure you want to ban this user?");
    if (!confirmed) return;

    try {
      const response = await Ban_User(id);
      window.alert("User has been banned successfully.");
      window.location.reload();
    } catch (error) {
      console.error(error);
      window.alert("Failed to ban the user.");
    }
  };

  const DeleteAccount = (id: number) => {
    // Implement the delete account logic here
  };

  return (
    <div style={styles.container}>
      <aside style={styles.sidebar}>
        <h2 style={styles.sidebarTitle}>Admin Panel</h2>
        <nav>
          <ul style={styles.navList}>
            <li style={styles.navItem} onClick={() => navigation('/9710010910511011297103101')}>Dashboard</li>
            <li style={styles.navItem}>
              <a 
                href="/9710010910511011297103101/categories" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ color: 'inherit', textDecoration: 'none' }}
              >
                Categories
              </a>
            </li>
            <li style={styles.navItem}>
              <a 
                href="/9710010910511011297103101/movies" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ color: 'inherit', textDecoration: 'none' }}
              >
                Movies
              </a>
            </li>
             <li style={styles.navItem}>
              <a 
                href="/9710010910511011297103101/commentsandratings" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ color: 'inherit', textDecoration: 'none' }}
              >
                Comments
              </a>
            </li>
            <li style={styles.navItem}>Settings</li>
            <li style={styles.navItem}>Logs</li>
          </ul>
        </nav>
      </aside>
      <main style={styles.main}>
        <header style={styles.header}>
          <h1 style={styles.title}>Dashboard</h1>
          <div style={styles.userSection}>Admin User</div>
        </header>
        <section style={styles.cardsContainer}>
          <Card title="Total Users" value={users.length} />
          <Card title="Active Users" value={users.filter(u => u.isActived === true).length} />
          <Card title="Pending Tasks" value={5} />
        </section>
        <section>
          <h2 style={styles.sectionTitle}>User Management</h2>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Role</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} style={styles.tr}>
                  <td style={styles.td}>{user.id}</td>
                  <td style={styles.td}>{user.username}</td>
                  <td style={styles.td}>{user.email}</td>
                  <td style={styles.td}>{user.admin.role}</td>
                  <td style={styles.td}>
                    <span
                      style={{
                        ...styles.statusBadge,
                        backgroundColor:
                          user.isActived === true ? '#4caf50' : '#f44336',
                      }}
                    >
                      {user.isActived}
                    </span>
                  </td>
                  <td style={styles.td}>
                    {user.id !== ac?.id ? (
                      user.isActived === true ? (
                        <button
                          style={{
                            backgroundColor: '#2f89fc',
                            color: '#fff',
                            padding: '5px 10px',
                            borderRadius: 4,
                            border: 'none',
                            cursor: 'pointer',
                          }}
                          onClick={() => BanUser(user.id)}
                        >
                          Ban
                        </button>
                      ) : (
                        <button
                          style={{
                            backgroundColor: '#2f89fc',
                            color: '#fff',
                            padding: '5px 10px',
                            borderRadius: 4,
                            border: 'none',
                            cursor: 'pointer',
                          }}
                          onClick={() => BanUser(user.id)}
                        >
                          Unban
                        </button>
                      )
                    ) : null}
                    
                    <button
                      style={{ backgroundColor: '#f44336', color: '#fff', padding: '5px 10px', borderRadius: 4, border: 'none', marginLeft: 10, cursor: 'pointer' }}
                      onClick={() => DeleteAccount(user.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    height: '100vh',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: '#f4f7fa',
    color: '#333',
  },
  sidebar: {
    width: 240,
    backgroundColor: '#2f3e46',
    color: '#fff',
    padding: '20px 15px',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
  },
  sidebarTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  navList: {
    listStyleType: 'none',
    padding: 0,
    margin: 0,
  },
  navItem: {
    padding: '10px 15px',
    marginBottom: 10,
    cursor: 'pointer',
    borderRadius: 4,
    transition: 'background-color 0.3s',
  },
  main: {
    flex: 1,
    padding: 30,
    overflowY: 'auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  userSection: {
    fontSize: 16,
    color: '#666',
  },
  cardsContainer: {
    display: 'flex',
    gap: 20,
    marginBottom: 40,
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
    display: 'flex',
    alignItems: 'center',
    gap: 15,
  },
  cardIcon: {
    fontSize: 36,
    color: '#2f89fc',
  },
  cardTitle: {
    margin: 0,
    fontSize: 16,
    color: '#777',
  },
  cardValue: {
    margin: 0,
    fontSize: 24,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
  },
  th: {
    textAlign: 'left',
    padding: '12px 15px',
    borderBottom: '2px solid #ddd',
    backgroundColor: '#f0f0f0',
    fontWeight: '600',
  },
  tr: {
    borderBottom: '1px solid #eee',
    transition: 'background-color 0.2s',
  },
  td: {
    padding: '12px 15px',
  },
  statusBadge: {
    display: 'inline-block',
    padding: '5px 10px',
    borderRadius: 12,
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
};

export default AdminPage;

