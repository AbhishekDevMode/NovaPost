const rawUrl =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.PROD
    ? 'https://novapost.onrender.com'
    : 'http://localhost:5000');

export const API_BASE_URL = rawUrl.replace(/\/$/, '');

console.log('[API Config] Using API Base URL:', API_BASE_URL);
