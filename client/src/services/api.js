import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' }
})

let isRefreshing = false, failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => error ? prom.reject(error) : prom.resolve(token))
  failedQueue = []
}

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => { failedQueue.push({ resolve, reject }) })
          .then(token => { originalRequest.headers.Authorization = `Bearer ${token}`; return api(originalRequest) })
      }
      originalRequest._retry = true
      isRefreshing = true
      try {
        const { data } = await api.post('/auth/refresh')
        processQueue(null, data.data.accessToken)
        api.defaults.headers.common['Authorization'] = `Bearer ${data.data.accessToken}`
        return api(originalRequest)
      } catch {
        processQueue(new Error('Session expired'), null)
        window.location.href = '/login'
        return Promise.reject(error)
      } finally { isRefreshing = false }
    }
    return Promise.reject(error)
  }
)

export default api
