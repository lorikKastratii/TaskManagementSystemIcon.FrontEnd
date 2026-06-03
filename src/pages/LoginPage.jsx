import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await login(form)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.detail ?? 'Login failed. Check your credentials.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth">
      <form className="auth__card" onSubmit={handleSubmit}>
        <h1 className="auth__title">Welcome back</h1>
        <p className="auth__subtitle">Sign in to manage your tasks.</p>

        <label className="form__label">
          Email
          <input
            className="input"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </label>

        <label className="form__label">
          Password
          <input
            className="input"
            type="password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </label>

        {error && <p className="form__error">{error}</p>}

        <button className="btn btn--primary btn--block" disabled={submitting}>
          {submitting ? 'Signing in…' : 'Sign in'}
        </button>

        <p className="auth__switch">
          No account? <Link to="/register">Create one</Link>
        </p>
      </form>
    </div>
  )
}
