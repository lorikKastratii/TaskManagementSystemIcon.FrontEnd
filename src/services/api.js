import axios from 'axios'

// Resolve the API base URL from the Vite environment, falling back to the local dev backend.
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5062/api'

const api = axios.create({ baseURL })

const TOKEN_KEY = 'tms.token'

export const tokenStorage = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
}

// Attach the JWT to every outgoing request when present.
api.interceptors.request.use((config) => {
  const token = tokenStorage.get()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// On 401 the token is missing/expired — clear it and bounce to login.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      tokenStorage.clear()
      if (window.location.pathname !== '/login') {
        window.location.assign('/login')
      }
    }
    return Promise.reject(error)
  },
)

export default api
