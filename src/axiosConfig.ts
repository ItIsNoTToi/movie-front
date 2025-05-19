import axios from "axios";

// Với Vite:
const host = 'http://localhost:3000';

// Nếu dùng Create React App, thay bằng: const host = process.env.REACT_APP_HOST;

const axiosInstance = axios.create({
  baseURL: host,
  withCredentials: true, // nếu bạn cần gửi cookie JWT
});

export default axiosInstance;
