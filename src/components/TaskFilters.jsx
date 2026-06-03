import { STATUSES, PRIORITIES } from '../constants'

// Controlled filter bar. Lifts every change up to the parent via onChange.
// `people` is only supplied for admins; when present an assignee filter is shown.
export default function TaskFilters({ filters, onChange, people = [] }) {
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

      {people.length > 0 && (
        <select
          className="input"
          value={filters.assigneeId}
          onChange={(e) => update({ assigneeId: e.target.value })}
        >
          <option value="">All assignees</option>
          {people.map((p) => (
            <option key={p.id} value={p.id}>{p.displayName}</option>
          ))}
        </select>
      )}

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
