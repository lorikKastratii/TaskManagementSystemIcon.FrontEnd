import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()

  return (
    <header className="navbar">
      <div className="navbar__brand">
        <span className="navbar__logo">✓</span>
        <span>Task Manager</span>
      </div>
      {user && (
        <div className="navbar__user">
          <span className="navbar__email">{user.email}</span>
          <button className="btn btn--ghost" onClick={logout}>
            Log out
          </button>
        </div>
      )}
    </header>
  )
}
