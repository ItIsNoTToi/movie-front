// src/index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter } from "react-router-dom";
import AppRoutes from './routes/routes';  // Import các route đã tạo
import reportWebVitals from './reportWebVitals';
import Header from './components/header';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <BrowserRouter>
    <Header/>
    <AppRoutes />  {/* Sử dụng component routes ở đây */}
  </BrowserRouter>
);

// Nếu bạn muốn đo lường hiệu suất của ứng dụng, bạn có thể sử dụng reportWebVitals.
reportWebVitals();
