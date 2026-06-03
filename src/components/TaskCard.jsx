import { STATUS_LABELS } from '../constants'

function formatDate(value) {
  if (!value) return null
  return new Date(value).toLocaleDateString()
}

// Presentational card for a single task. All actions are delegated to the parent.
// `people`/`onAssign` are supplied for admins so they can reassign the task inline.
export default function TaskCard({ task, onToggle, onEdit, onDelete, onAssign, people = [], dragHandleProps }) {
  const isAdmin = people.length > 0

  return (
    <div className={`card ${task.isCompleted ? 'card--done' : ''}`}>
      <div className="card__drag" {...dragHandleProps} title="Drag to reorder">⠿</div>

      <input
        type="checkbox"
        className="card__check"
        checked={task.isCompleted}
        onChange={() => onToggle(task)}
        aria-label="Toggle complete"
      />

      <div className="card__body">
        <div className="card__title">{task.title}</div>
        {task.description && <div className="card__desc">{task.description}</div>}
        <div className="card__meta">
          <span className={`badge badge--status-${task.status.toLowerCase()}`}>
            {STATUS_LABELS[task.status]}
          </span>
          <span className={`badge badge--priority-${task.priority.toLowerCase()}`}>
            {task.priority}
          </span>
          {task.dueDate && <span className="card__due">Due {formatDate(task.dueDate)}</span>}
          {task.assigneeName && <span className="badge badge--assignee">@{task.assigneeName}</span>}
        </div>

        {isAdmin && (
          <label className="card__assign">
            Assignee
            <select
              className="input input--sm"
              value={task.assigneeId ?? ''}
              onChange={(e) => onAssign(task, e.target.value)}
            >
              <option value="">Unassigned</option>
              {people.map((p) => (
                <option key={p.id} value={p.id}>{p.displayName}</option>
              ))}
            </select>
          </label>
        )}
      </div>

      <div className="card__actions">
        <button className="btn btn--icon" onClick={() => onEdit(task)} title="Edit">✎</button>
        <button className="btn btn--icon btn--danger" onClick={() => onDelete(task)} title="Delete">🗑</button>
      </div>
    </div>
  )
}
