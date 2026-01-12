import { Link } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'
import { useAuth } from '../../context/AuthContext'

export default function Navbar() {
  const { token, logout } = useAuth()

  return (
    <header className="app-navbar sticky top-0 z-40">
      <div className="container mx-auto flex items-center justify-between py-3">
        <Link to="/" className="flex items-center gap-3">
          <div className="brand">TM</div>
          <div className="hidden sm:block">
            <div className="font-semibold">TaskManager</div>
            <div className="text-xs text-muted">Simple, focused task management</div>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center bg-white/60 dark:bg-gray-800/60 rounded-full px-3 py-1 gap-2 border border-transparent hover:border-border transition">
            <input placeholder="Search tasks..." className="bg-transparent outline-none text-sm w-48" />
          </div>
          <ThemeToggle />
          {token ? (
            <>
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              <button onClick={logout} className="btn-ghost">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/signup" className="btn-primary">Signup</Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
