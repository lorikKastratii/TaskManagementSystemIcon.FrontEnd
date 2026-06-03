import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '', confirmPassword: '' })
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await register(form)
      navigate('/')
    } catch (err) {
      const errors = err.response?.data?.errors
      setError(errors ? Object.values(errors).flat()[0] : 'Registration failed.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth">
      <form className="auth__card" onSubmit={handleSubmit}>
        <h1 className="auth__title">Create account</h1>
        <p className="auth__subtitle">Start organising your tasks in seconds.</p>

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
          <span className="form__hint">Min 6 chars, with upper, lower and a digit.</span>
        </label>

        <label className="form__label">
          Confirm password
          <input
            className="input"
            type="password"
            required
            value={form.confirmPassword}
            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
          />
        </label>

        {error && <p className="form__error">{error}</p>}

        <button className="btn btn--primary btn--block" disabled={submitting}>
          {submitting ? 'Creating…' : 'Create account'}
        </button>

        <p className="auth__switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </form>
    </div>
  )
}
