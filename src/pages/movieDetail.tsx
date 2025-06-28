import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "../axiosConfig";
import './MovieDetail.css';
import { v4 as uuidv4 } from 'uuid';
import { AddEpisode, convertToMySQLDate, deleteEpisode, EditEpisode } from "../services/episodeService";
import { Genre, Hashtag } from "../types/movie";
import { GetCommentAndrating, PostCommentAndrating } from "../services/commentservices";
import { Rating } from 'react-simple-star-rating';

type CommentType = {
  account: { username: string };
  comment: string;
  rating: number;
};

type EpisodeType = {
  id: number;
  title: string;
  description: string;
  episodeNumber: number;
  videoUrl: string;
  releaseDate: string;
};

type MovieDetailType = {
  id: number;
  title: string;
  description: string;
  releaseDate: string;
  posterUrl: string;
  episodes: EpisodeType[];
  genres: Genre[];
  hashtags: Hashtag[];
};

const MovieDetail = () => {
  const [user, setUser] = useState<any>(null);
  const { id } = useParams<{ id: string }>();
  const [epID, setepId] = useState<number>(0);
  const [title, setTitle] = useState<string>('');
  const [description, setdescription] = useState<string>('');
  const [episodeNumber, setepisodeNumber] = useState<number>(0);
  const [videoUrl, setvideoUrl] = useState<string>('');
  const [releaseDate, setreleaseDate] = useState<string>('');
  const [listEpisode, setlistEpisode] = useState<EpisodeType[]>([]);
  const [movie, setMovie] = useState<MovieDetailType | null>(null);
  const [modeedit, setmodeedit] = useState<boolean>(false);
  const [editForm, seteditForm] = useState<boolean>(false);
  const [a, seta] = useState<any>();
  const role = JSON.parse(localStorage.getItem("role") || "{}");
  
  const [rating, setRating] = useState<number>(0); // Lưu trữ điểm đánh giá
  const [comment, setComment] = useState<string>(''); // Lưu trữ nội dung bình luận
  const [commentsList, setCommentsList] = useState<CommentType[]>([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    GetCommentAndrating(id)
    .then(data => {
      // console.log('data từ API:', data); // <-- kiểm tra kỹ ở đây
      setCommentsList(data.rating);
    });
  }, [])

  useEffect(() => {
    if (id) {
      axios.get(`/movie/${id}`)
        .then(res => {
          const moviedetail = res.data.movie; // lấy đúng key "movie"
          setMovie(moviedetail);
          setlistEpisode(moviedetail.episodes || []);
        })
        .catch(err => console.error(err));}
  }, [id]);

  const ModeEdit = async () => {
    modeedit === false ? setmodeedit(true) : setmodeedit(false); 
  }

  if (!movie) return <p>Loading...</p>;

  const createEP = async () => {
    setTitle(''); 
    setdescription('');
    setepisodeNumber(0);
    setvideoUrl('');
    setreleaseDate('');
    seta(false);
    seteditForm(true);
  }

  const editEP = async (epId: any) => {
    const ep = await listEpisode.find(e => e.id === epId);
    if (ep) {
      setepId(ep.id);
      setTitle(ep.title); 
      setdescription(ep.description);
      setepisodeNumber(ep.episodeNumber);
      setvideoUrl(ep.videoUrl);
      setreleaseDate(ep.releaseDate);
    }
    seta(true);
    seteditForm(true);
  }

  const DeleteEP = async (epId: any) => {
    try {
      await deleteEpisode(epId, movie.id)
      .then(data => alert(data.message))
      setlistEpisode(prev => prev.filter(e => e.id !== epId));
    } catch (error) {
      console.log(error);
      alert("Xóa tập phim thất bại!");
    }
  }

  const resetForm = async () => {
    setTitle(''); 
    setdescription('');
    setepisodeNumber(0);
    setvideoUrl('');
    setreleaseDate('');
    seteditForm(false);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // if (!validateForm()) return;

    const epData: EpisodeType = {
      id: epID,
      title: title,
      description: description,
      episodeNumber: episodeNumber,
      releaseDate: convertToMySQLDate(releaseDate),
      videoUrl: videoUrl, // nếu có trường này
    };

    try {
      if (a) {
        // Update movie local
        setlistEpisode(prev => prev?.map(m => m.id === a.id ? epData : m) || null);
        await EditEpisode(epData, movie.id, epData.id)
        .then(data => {
          window.location.reload();
          // console.log(data);
        })
      } else {
        // Add movie
        //console.log(movieData);
        setlistEpisode(prev => prev ? [...prev, epData] : [epData]);
        await AddEpisode(epData, movie.id).then(data => {
          //console.log(data);
          window.location.reload();
        })
      }
      resetForm();
    } catch (error) {
      console.error(error);
    }
  };

  // Hàm để xử lý khi người dùng gửi đánh giá và bình luận
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Ngăn chặn hành vi mặc định của form

    // Kiểm tra xem người dùng đã nhập bình luận hay chưa
    if (!comment) {
      alert("Vui lòng nhập bình luận của bạn!");
      return;
    }

    // Thêm bình luận vào danh sách bình luận
    setCommentsList(prev => [
        ...prev,
        {
          account: { username: user.username },
          comment: comment,
          rating: rating
        }
      ]);
    setComment(''); // Reset nội dung bình luận

    // Gửi đánh giá và bình luận đến server (nếu cần)
    try {
      await PostCommentAndrating(id, comment, rating, user)
      // .then(data => console.log(data));
      alert("Bình luận của bạn đã được gửi!");
    } catch (error) {
      console.error("Có lỗi xảy ra khi gửi bình luận:", error);
      alert("Gửi bình luận thất bại!");
    }
  };

  return (
    <div className="movie-detail-container" >
      <div style={{ display: "flex", width: '100%', justifyContent: "space-between", alignItems: 'center',}}>
        <h1 className="movie-title">{movie.title}</h1>
        {
          role === 'Admin' ?
          <button style={{
            width: '100px',
            height: '30px',
            display: 'flex', // Bắt buộc để dùng justifyContent + alignItems
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '7px',
            border: 'none', // thay vì borderWidth
            background: 'linear-gradient(to right bottom, rgb(19, 156, 241), rgba(185, 241, 19, 0.5))',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)', // chỉ đổ bóng đen đơn giản
          }} onClick={ModeEdit}>Admin Mode</button>:
          <div></div>
        }
        <div></div>
      </div>
      
      <div style={{display: 'flex', justifyContent: 'space-around', padding: 2, }}>
        <div>
          <img src={movie.posterUrl} alt={movie.title} style={{ borderWidth: 10, borderColor: 'red', borderRadius: 12}} />
        </div>
        <div style={{ padding: 10, }}>
          <p className="movie-description">{movie.description}</p>
          <p className="movie-release-date">Release Date: {movie.releaseDate}</p>
          <p className="" style={{ color: 'black', }}>Genres: {movie.genres?.map(a => a.name).join(',')}</p>
          <p className="" style={{ color: 'black', }}>Hashtags: {movie.hashtags?.map(a => a.name).join(',')}</p>
        </div>
        <div></div>
      </div>
      {
        modeedit && (
          <div style={{ marginLeft: '4%', marginTop: '12px', }}>
            <button type="button" 
            style={{
              width: '100px',
              height: '30px',
              display: 'flex', // Bắt buộc để dùng justifyContent + alignItems
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: '7px',
              border: 'none', // thay vì borderWidth
              background: 'linear-gradient(to right bottom, rgb(19, 156, 241), rgba(185, 241, 19, 0.5))',
              boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)', // chỉ đổ bóng đen đơn giản
            }} onClick={() => createEP()}>Create Ep</button>
          </div>
        )
      }
      
      <div className="episode-list">
        <ul className="episode">
          {listEpisode.map((episode) => (
            <li key={episode.id} className="episode-item">
              <Link to={`/movie/${movie.id}/${episode.episodeNumber}`} className="episode-title">
                {episode.title}
              </Link>
              {modeedit && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px'}}>
                  <button  
                  style={{
                    width: '100px',
                    height: '30px',
                    display: 'flex', // Bắt buộc để dùng justifyContent + alignItems
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: '7px',
                    border: 'none', // thay vì borderWidth
                    background: 'linear-gradient(to right bottom, rgb(19, 156, 241), rgba(185, 241, 19, 0.5))',
                    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)',
                  }} onClick={ () => editEP(episode.id)}>Edit</button>
                  <button 
                  style={{
                    width: '100px',
                    height: '30px',
                    display: 'flex', // Bắt buộc để dùng justifyContent + alignItems
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: '7px',
                    background: 'linear-gradient(to right bottom, rgb(19, 156, 241), rgba(185, 241, 19, 0.5))',
                    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)',
                  }} onClick={ () => DeleteEP(episode.id)}>Delete</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div style={{ padding: '20px', justifyContent: 'flex-start', borderRadius: '12px', }}>
        {/* rate and comment */}
        <div className="movie-rating-and-comment">
          <h2>Đánh giá và bình luận</h2>
          {user ? (
            <form onSubmit={handleCommentSubmit}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <label>Điểm đánh giá:</label>
                <Rating
                  onClick={(rate) => setRating(rate)}
                  initialValue={rating}
                />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <label>Bình luận:</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Nhập bình luận của bạn..."
                />
              </div>
              <button type="submit">Gửi bình luận</button>
            </form>
          ) : (
            <p style={{ color: "red" }}>Vui lòng <Link to="/login">đăng nhập</Link> để bình luận.</p>
          )}

          <div className="comments-list">
            <h3>Bình luận:</h3>
            <ul>
              {commentsList?.map((c: any, index) => (
                <li key={index}>
                  <div>{c.account.username}: {c.comment} - 
                    <div style={{ display: 'inline-block', marginLeft: '10px' }}>
                      <Rating
                        initialValue={c.rating}
                        readonly
                        size={20}
                        allowFraction
                      />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {editForm && (
        <div style={styles.modalOverlay}>
          <div style={styles.bg}>
            <form style={styles.form} onSubmit={handleSubmit}>
              <label style={{ color: 'black', }}>Title</label>
              <input
                type="text"
                name="title"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
                style={{}}
              />
              <label style={{ color: 'black', }}>Description</label>
              <textarea
                name="description"
                value={description}
                onChange={(e) => {
                  setdescription(e.target.value);
                }}
                style={{}}
              />
              <label style={{ color: 'black', }}>Episode Number</label>
              <input
                type="number"
                name="episodeNumber"
                value={episodeNumber}
                onChange={(e) => {
                  setepisodeNumber(Number(e.target.value));
                }}
                style={{}}
              />
              <label style={{ color: 'black', }}>Video Url</label>
              <input
                type="text"
                name="videoUrl"
                value={videoUrl}
                onChange={(e) => {
                  setvideoUrl(e.target.value);
                }}
                style={{}}
              />
              <label style={{ color: 'black', }}>release Date</label>
              <input
                type="text"
                name="releaseDate"
                value={releaseDate}
                onChange={(e) => {
                  setreleaseDate(e.target.value);
                }}
                style={{}}
              />
              <div style={{display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: '5px', }}>
                {a ? <button type="submit">Edit</button> : <button type="submit">Add</button> }
                <button type="button" onClick={resetForm}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    zIndex: 1000,
    overflowY: "auto",
    paddingRight: "10px",
  },
  bg:{
    width: '300px',
    height: 'auto',
    padding: '6%',
    backgroundColor: 'white',
    borderRadius: '60% 40% 60% 40% / 50% 60% 40% 30%'
  },
  form: {
    paddingTop: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '3px 3px',
  },
}

export default MovieDetail;
// end{code}