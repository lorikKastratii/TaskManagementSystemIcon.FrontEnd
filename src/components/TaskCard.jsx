import { STATUS_LABELS } from '../constants'

function formatDate(value) {
  if (!value) return null
  return new Date(value).toLocaleDateString()
}

// Presentational card for a single task. All actions are delegated to the parent.
export default function TaskCard({ task, onToggle, onEdit, onDelete, dragHandleProps }) {
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
        </div>
      </div>

      <div className="card__actions">
        <button className="btn btn--icon" onClick={() => onEdit(task)} title="Edit">✎</button>
        <button className="btn btn--icon btn--danger" onClick={() => onDelete(task)} title="Delete">🗑</button>
      </div>
    </div>
  )
}
