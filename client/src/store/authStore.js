import { create } from 'zustand'

export const useAuthStore = create((set, get) => ({
  user: null, accessToken: null, isAuthenticated: false, loading: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setToken: (token) => set({ accessToken: token }),
  login: async (email, password) => {
    set({ loading: true })
    try {
      const { default: api } = await import('../services/api')
      const { data } = await api.post('/auth/login', { email, password })
      set({ user: data.data.user, accessToken: data.data.accessToken, isAuthenticated: true, loading: false })
      api.defaults.headers.common['Authorization'] = `Bearer ${data.data.accessToken}`
      return data
    } catch (error) {
      set({ loading: false })
      throw error
    }
  },
  logout: async () => {
    try {
      const { default: api } = await import('../services/api')
      await api.post('/auth/logout')
    } catch {}
    set({ user: null, accessToken: null, isAuthenticated: false })
    delete api.defaults.headers.common['Authorization']
    window.location.href = '/'
  },
  checkAuth: async () => {
    try {
      const { default: api } = await import('../services/api')
      const { data } = await api.get('/auth/me')
      set({ user: data.data.user, isAuthenticated: true })
      return data.data.user
    } catch { set({ user: null, isAuthenticated: false }); return null }
  }
}))
