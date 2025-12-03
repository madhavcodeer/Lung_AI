// API Configuration
// Change this to your deployed backend URL after deployment
const API_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:5000'  // Local development
    : 'https://your-backend-url.onrender.com';  // Production - UPDATE THIS AFTER DEPLOYMENT

console.log('API URL:', API_URL);
