import React, { useEffect, useState } from 'react';
import { useParams, Link } from "react-router-dom";
import axios from "../axiosConfig";
import { fetchWatchHistory } from '../services/movieService';
import { User } from '../types/user';

const WatchHistory = () => {
    const [user, setUser] = useState<User>();
    const [watchHistory, setWatchHistory] = useState<any[]>([]);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        else{
            console.log('kco');
        }
    }, []);

    // console.log(user);
    
    useEffect(() => {
        if (user?.id) {
            fetchWatchHistory(user.id)
            .then(data => setWatchHistory(data.data))
            .catch(console.error);
        }
    }, [user]);  // effect sẽ chạy lại khi `user` thay đổi


    return (
        <div>
        {user ? (
            <div>
            <h2>{user.username}'s Watch History</h2>
            <div
                style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                rowGap: '20px',        // khoảng cách giữa các hàng
                columnGap: '10px',     // khoảng cách giữa các cột
                padding: '12px',
                }}
            >
                {watchHistory.length > 0 ? (
                watchHistory.map((item) => (
                    <Link
                    to={`/movie/${item.movie.id}`}
                    key={item.id}            // SỬA: dùng item.id làm key
                    style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                    <img
                        src={item.movie.posterUrl}
                        alt={item.movie.title}
                        style={{
                        width: '100%',
                        borderRadius: '8px',
                        display: 'block',
                        marginBottom: '8px',
                        }}
                    />
                    <div
                        style={{
                        textAlign: 'center',
                        fontWeight: 500,
                        fontSize: '0.9rem',
                        lineHeight: '1.2',
                        }}
                    >
                        {item.movie.title}
                    </div>
                    </Link>
                ))
                ) : (
                <p>No watch history available.</p>
                )}
            </div>
            </div>
        ) : (
            <p>Please log in to view your watch history.</p>
        )}
        </div>

    );
};

export default WatchHistory;
