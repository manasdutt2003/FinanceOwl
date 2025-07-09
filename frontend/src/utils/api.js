import axios from 'axios'

const baseURL = import.meta.env.MODE === 'development' ? 'http://localhost:3000/api/v1' : '/api/v1'
const api = axios.create({
    baseURL: baseURL,
    withCredentials: true,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
})
api.interceptors.response.use((response)=>{
    return response
},(error)=>{
    // Remove automatic redirect - let components handle authentication flow
    return Promise.reject(error)
})

export default api