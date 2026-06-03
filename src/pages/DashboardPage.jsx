import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { dashboardService } from '../services/dashboardService'
import { STATUS_LABELS, STATUS_COLORS, PRIORITY_COLORS } from '../constants'

const pct = (n) => `${Math.round(n * 100)}%`

// A single headline metric card.
function StatCard({ label, value, accent }) {
  return (
    <div className="stat-card">
      <div className="stat-card__value" style={accent ? { color: accent } : undefined}>{value}</div>
      <div className="stat-card__label">{label}</div>
    </div>
  )
}

// Horizontal bar breakdown for a keyed { label, count, color } set, scaled to the largest bucket.
function Breakdown({ title, rows }) {
  const max = Math.max(1, ...rows.map((r) => r.count))
  return (
    <section className="panel">
      <h2 className="panel__title">{title}</h2>
      <div className="breakdown">
        {rows.map((r) => (
          <div key={r.label} className="breakdown__row">
            <span className="breakdown__label">{r.label}</span>
            <div className="breakdown__track">
              <div
                className="breakdown__bar"
                style={{ width: `${(r.count / max) * 100}%`, background: r.color }}
              />
            </div>
            <span className="breakdown__count">{r.count}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

export default function DashboardPage() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true
    dashboardService
      .stats()
      .then((data) => active && setStats(data))
      .catch(() => active && setError('Could not load dashboard statistics.'))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [])

  const statusRows = stats
    ? Object.entries(stats.tasksByStatus).map(([key, count]) => ({
        label: STATUS_LABELS[key] ?? key,
        count,
        color: STATUS_COLORS[key] ?? '#94a3b8',
      }))
    : []

  const priorityRows = stats
    ? Object.entries(stats.tasksByPriority).map(([key, count]) => ({
        label: key,
        count,
        color: PRIORITY_COLORS[key] ?? '#94a3b8',
      }))
    : []

  return (
    <div className="page">
      <Navbar />
      <main className="container container--wide">
        <div className="page__header">
          <div>
            <h1 className="page__title">Dashboard</h1>
            <p className="page__subtitle">An overview of all tasks across the board</p>
          </div>
        </div>

        {error && <p className="form__error">{error}</p>}
        {loading ? (
          <p className="empty">Loading…</p>
        ) : (
          stats && (
            <>
              <div className="stat-grid">
                <StatCard label="Total tasks" value={stats.totalTasks} />
                <StatCard label="Completed" value={stats.completedTasks} accent="#15803d" />
                <StatCard label="Active" value={stats.activeTasks} accent="#1d4ed8" />
                <StatCard label="Overdue" value={stats.overdueTasks} accent="#dc2626" />
                <StatCard label="Unassigned" value={stats.unassignedTasks} accent="#a16207" />
                <StatCard label="Completion rate" value={pct(stats.completionRate)} accent="#6d28d9" />
              </div>

              <div className="panel-grid">
                <Breakdown title="Tasks by status" rows={statusRows} />
                <Breakdown title="Tasks by priority" rows={priorityRows} />
              </div>

              <section className="panel">
                <h2 className="panel__title">Completed by user</h2>
                {stats.perUser.length === 0 ? (
                  <p className="empty">No users yet.</p>
                ) : (
                  <table className="stat-table">
                    <thead>
                      <tr>
                        <th>User</th>
                        <th>Assigned</th>
                        <th>Completed</th>
                        <th>Active</th>
                        <th>Completion</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.perUser.map((u) => (
                        <tr key={u.userId}>
                          <td>{u.displayName}</td>
                          <td>{u.assigned}</td>
                          <td style={{ color: '#15803d', fontWeight: 600 }}>{u.completed}</td>
                          <td>{u.active}</td>
                          <td>{u.assigned === 0 ? '—' : pct(u.completed / u.assigned)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </section>
            </>
          )
        )}
      </main>
    </div>
  )
}
