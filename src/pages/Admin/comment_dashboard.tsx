import React, { useState, useEffect } from 'react';
import { GetAllCommentAndrating } from '../../services/commentservices';
import { Movie } from '../../types/movie';
import { User } from '../../types/user';

enum RatingStatus {
  APPROVED = 'approved',
  PENDING = 'pending',
  REJECTED = 'rejected',
}

interface Account {
  id: string;
  username?: string;
  email?: string;
}

interface CommentRating {
  id: string;
  comment: string;
  rating: number;
  createdAt: string;
  movie: Movie;
  account: Account;
  status: RatingStatus;
}

const AdminCommentRating: React.FC = () => {
  // Sample data - replace with API calls in a real app
  const [comments, setComments] = useState<CommentRating[]>([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [ratingFilter, setRatingFilter] = useState<string>('all');

  // Filtered comments based on search and filters
  const filteredComments = comments.filter(comment => {
    const matchesSearch = comment.comment.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          comment.account.username?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || comment.status === statusFilter;
    const matchesRating = ratingFilter === 'all' || comment.rating === parseInt(ratingFilter);
    
    return matchesSearch && matchesStatus && matchesRating;
  });

  useEffect(() => {
    GetAllCommentAndrating()
    .then(data => {
        setComments(data.ratings);
    })
  },[]);

  console.log(comments);

  // Handle status change
  const handleStatusChange = (id: string, newStatus: RatingStatus) => {
    setComments(comments.map(comment => 
      comment.id === id ? { ...comment, status: newStatus } : comment
    ));
  };

  // Handle comment deletion
  const handleDelete = (id: string) => {
    setComments(comments.filter(comment => comment.id !== id));
  };

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ color: '#333', marginBottom: '30px' }}>Comments & Ratings Management</h1>
      
      {/* Filters and Search */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '15px',
        marginBottom: '20px',
      }}>
        <div style={{ flex: 1, minWidth: '250px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Search:</label>
          <input
            type="text"
            placeholder="Search comments or users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}
          />
        </div>
        
        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '10px',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}
          >
            <option value="all">All Statuses</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        
        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>Rating:</label>
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            style={{
              padding: '10px',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>
      </div>
      
      {/* Comments Table */}
      <div style={{
        overflowX: 'auto',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        borderRadius: '8px'
      }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse'
        }}>
          <thead style={{
            backgroundColor: '#f8f9fa',
            borderBottom: '2px solid #e9ecef'
          }}>
            <tr>
              <th style={{ padding: '12px 16px', textAlign: 'left' }}>User</th>
              <th style={{ padding: '12px 16px', textAlign: 'left' }}>Comment</th>
              <th style={{ padding: '12px 16px', textAlign: 'left' }}>Rating</th>
              <th style={{ padding: '12px 16px', textAlign: 'left' }}>Date</th>
              <th style={{ padding: '12px 16px', textAlign: 'left' }}>Status</th>
              <th style={{ padding: '12px 16px', textAlign: 'left' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredComments.map((comment) => (
              <tr key={comment.id} className='hover-row'>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ fontWeight: '500' }}>{comment.account.username}</div>
                  <div style={{ fontSize: '0.8em', color: '#6c757d' }}>ID: {comment.account.id}</div>
                </td>
                <td style={{ padding: '12px 16px' }}>{comment.comment}</td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {Array.from({ length: 5 }, (_, i) => (
                      <span
                        key={i}
                        style={{
                          color: i < comment.rating ? '#ffc107' : '#e4e5e9',
                          fontSize: '1.2em'
                        }}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  {new Date(comment.createdAt).toLocaleDateString()}
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '0.8em',
                    fontWeight: '500',
                    backgroundColor:
                      comment.status === 'approved' ? '#d4edda' :
                      comment.status === 'rejected' ? '#f8d7da' : '#fff3cd',
                    color:
                      comment.status === 'approved' ? '#155724' :
                      comment.status === 'rejected' ? '#721c24' : '#856404'
                  }}>
                    {comment.status.charAt(0).toUpperCase() + comment.status.slice(1)}
                  </span>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handleStatusChange(comment.id, RatingStatus.APPROVED)}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleStatusChange(comment.id, RatingStatus.REJECTED)}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleDelete(comment.id)}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#6c757d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredComments.length === 0 && (
          <div style={{
            padding: '40px',
            textAlign: 'center',
            color: '#6c757d'
          }}>
            No comments match your filters
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCommentRating;
