function formatDate(value) {
  if (!value) return null
  return new Date(value).toLocaleDateString()
}

// Cards show only a short preview of the description; the full text is in the details modal.
const DESC_PREVIEW_LIMIT = 90

// Stops a mousedown from starting a card drag, so interactive controls stay usable even though
// the whole card is the drag handle.
const stopDrag = (e) => e.stopPropagation()

// Presentational card for a single task. The whole card is the drag handle (props applied by the
// parent) and clicking it opens the details modal. Interactive controls swallow the event so they
// neither start a drag nor open the modal.
export default function TaskCard({ task, onToggle, onOpen, onDelete }) {
  const isLong = task.description && task.description.length > DESC_PREVIEW_LIMIT
  const preview = isLong ? task.description.slice(0, DESC_PREVIEW_LIMIT).trimEnd() : task.description

  return (
    <div
      className={`card card--draggable ${task.isCompleted ? 'card--done' : ''}`}
      onClick={() => onOpen(task)}
      title="Open details"
    >
      <input
        type="checkbox"
        className="card__check"
        checked={task.isCompleted}
        onChange={() => onToggle(task)}
        onMouseDown={stopDrag}
        onClick={stopDrag}
        aria-label="Toggle complete"
      />

      <div className="card__body">
        <div className="card__title">{task.title}</div>
        {task.description && (
          <div className="card__desc">
            {preview}
            {isLong && <>… <span className="card__more">see more</span></>}
          </div>
        )}
        <div className="card__meta">
          <span className={`badge badge--priority-${task.priority.toLowerCase()}`}>
            {task.priority}
          </span>
          {task.dueDate && <span className="card__due">Due {formatDate(task.dueDate)}</span>}
        </div>
      </div>

      <div className="card__actions" onMouseDown={stopDrag}>
        <button
          className="btn btn--icon btn--danger"
          onClick={(e) => { stopDrag(e); onDelete(task) }}
          title="Delete"
        >
          🗑
        </button>
      </div>
    </div>
  )
}
