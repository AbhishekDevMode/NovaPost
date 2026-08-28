// Use the local API while developing, and Render when a production build has
// not been given an explicit VITE_API_BASE_URL by its hosting provider.
export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.PROD
    ? 'https://novapost.onrender.com'
    : 'http://localhost:5000')
).replace(/\/$/, '');
