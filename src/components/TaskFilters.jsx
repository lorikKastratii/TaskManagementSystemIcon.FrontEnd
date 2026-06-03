import { STATUSES, PRIORITIES } from '../constants'

// Controlled filter bar. Lifts every change up to the parent via onChange.
export default function TaskFilters({ filters, onChange }) {
  const update = (patch) => onChange({ ...filters, ...patch })

  return (
    <div className="filters">
      <input
        className="input"
        type="search"
        placeholder="Search tasks…"
        value={filters.search}
        onChange={(e) => update({ search: e.target.value })}
      />

      <select className="input" value={filters.status} onChange={(e) => update({ status: e.target.value })}>
        <option value="">All statuses</option>
        {STATUSES.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      <select className="input" value={filters.priority} onChange={(e) => update({ priority: e.target.value })}>
        <option value="">All priorities</option>
        {PRIORITIES.map((p) => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>

      <select
        className="input"
        value={filters.isCompleted}
        onChange={(e) => update({ isCompleted: e.target.value })}
      >
        <option value="">Any</option>
        <option value="false">Active</option>
        <option value="true">Completed</option>
      </select>
    </div>
  )
}
