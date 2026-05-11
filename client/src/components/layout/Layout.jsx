import { NavLink, Outlet } from 'react-router-dom'
import { useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useNotificationStore } from '@/store/notificationStore'
import { Menu, X, Bell, User, LogOut, Briefcase, Home, Users, FileText, Settings } from 'lucide-react'
import { cn } from '@/utils/utils'

export default function Layout() {
  const { user, isAuthenticated, logout } = useAuthStore()
  const { unreadCount } = useNotificationStore()
  const [mobileOpen, setMobileOpen] = useState(false)
  const isAdmin = user?.role === 'ADMIN'

  const candidateLinks = [
    { to: '/dashboard', icon: Home, label: 'Dashboard' },
    { to: '/dashboard/profile', icon: User, label: 'Profile' },
    { to: '/dashboard/applications', icon: FileText, label: 'Applications' },
    { to: '/dashboard/saved-jobs', icon: Briefcase, label: 'Saved Jobs' }
  ]

  const adminLinks = [
    { to: '/admin', icon: Home, label: 'Overview' },
    { to: '/admin/jobs', icon: Briefcase, label: 'Jobs' },
    { to: '/admin/companies', icon: Users, label: 'Companies' },
    { to: '/admin/candidates', icon: User, label: 'Candidates' },
    { to: '/admin/applications', icon: FileText, label: 'Applications' },
    { to: '/admin/settings', icon: Settings, label: 'Settings' }
  ]

  const links = isAdmin ? adminLinks : isAuthenticated ? candidateLinks : null

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 bg-white border-b shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <NavLink to="/" className="text-2xl font-heading font-bold text-primary">TalentBridge</NavLink>
            <div className="hidden md:flex items-center gap-1">
              <NavLink to="/jobs" className={({isActive}) => cn('px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-100', isActive && 'text-primary')}>Jobs</NavLink>
              <NavLink to="/companies" className={({isActive}) => cn('px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-100', isActive && 'text-primary')}>Companies</NavLink>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {isAuthenticated && (
              <button className="relative p-2 hover:bg-gray-100 rounded-lg">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && <span className="absolute -top-1 -right-1 h-5 w-5 bg-error text-white text-xs rounded-full flex items-center justify-center">{unreadCount}</span>}
              </button>
            )}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <NavLink to={isAdmin ? '/admin' : '/dashboard'} className="text-sm font-medium text-gray-600 hover:text-primary">
                  {user?.profile?.fullName || user?.email}
                </NavLink>
                <button onClick={logout} className="p-2 hover:bg-gray-100 rounded-lg" title="Logout"><LogOut className="h-5 w-5" /></button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <NavLink to="/login"><button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-primary">Login</button></NavLink>
                <NavLink to="/register"><button className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary-600">Sign Up</button></NavLink>
              </div>
            )}
            <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </nav>
      </header>

      {mobileOpen && links && (
        <div className="md:hidden bg-white border-b p-4">
          <div className="flex flex-col gap-1">
            {links.map(({ to, icon: Icon, label }) => (
              <NavLink key={to} to={to} onClick={() => setMobileOpen(false)} className={({isActive}) => cn('flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium', isActive ? 'bg-primary/10 text-primary' : 'text-gray-600')}>
                <Icon className="h-5 w-5" />{label}
              </NavLink>
            ))}
          </div>
        </div>
      )}

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-secondary text-white py-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-heading font-bold text-xl mb-4">TalentBridge</h4>
            <p className="text-gray-400 text-sm">Connecting talent with opportunity. Find your dream job or the perfect candidate.</p>
          </div>
          <div>
            <h5 className="font-semibold mb-4">For Candidates</h5>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><NavLink to="/jobs" className="hover:text-white">Browse Jobs</NavLink></li>
              <li><NavLink to="/companies" className="hover:text-white">Companies</NavLink></li>
              <li><NavLink to="/register" className="hover:text-white">Create Profile</NavLink></li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold mb-4">Resources</h5>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white">Career Tips</a></li>
              <li><a href="#" className="hover:text-white">Salary Guide</a></li>
              <li><a href="#" className="hover:text-white">Contact Us</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold mb-4">Legal</h5>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-8 pt-8 border-t border-gray-700 text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} TalentBridge. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
