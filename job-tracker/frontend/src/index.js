import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import './index.css';
import App from './App';

axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);