import axios from 'axios'

// VITE_API_URL lets the frontend talk to an API on another host. Without it,
// development uses the local backend and production expects the API to be
// served from the same origin under /api/v1.
const baseURL =
    import.meta.env.VITE_API_URL ||
    (import.meta.env.MODE === 'development' ? 'http://localhost:3000/api/v1' : '/api/v1')

const api = axios.create({
    baseURL,
    withCredentials: true,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
})

export default api
