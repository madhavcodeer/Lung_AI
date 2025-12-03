// API Configuration
// Backend deployed on Render.com
const API_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:5000'  // Local development
    : 'https://lung-ai.onrender.com';  // Production backend

console.log('API URL:', API_URL);
