import { create } from 'zustand'

const getStoredUser = () => {
  const stored = localStorage.getItem('talentbridge_session')
  return stored ? JSON.parse(stored) : null
}

export const useAuthStore = create((set, get) => ({
  user: getStoredUser(),
  isAuthenticated: !!getStoredUser(),
  login: (user) => {
    localStorage.setItem('talentbridge_session', JSON.stringify(user))
    set({ user, isAuthenticated: true })
  },
  logout: () => {
    localStorage.removeItem('talentbridge_session')
    set({ user: null, isAuthenticated: false })
    window.location.href = '/'
  },
  setUser: (user) => {
    localStorage.setItem('talentbridge_session', JSON.stringify(user))
    set({ user })
  }
}))