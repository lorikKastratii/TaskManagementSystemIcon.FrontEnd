import { useState } from 'react'
import { STATUSES, PRIORITIES, STATUS_LABELS } from '../constants'

// Modal create/edit form. `task` null => create mode; otherwise edit mode.
// `people` is supplied for admins so they can choose an assignee when creating a task.
export default function TaskForm({ task, onSubmit, onClose, people = [] }) {
  const [form, setForm] = useState({
    title: task?.title ?? '',
    description: task?.description ?? '',
    status: task?.status ?? 'Todo',
    priority: task?.priority ?? 'Medium',
    dueDate: task?.dueDate ? task.dueDate.substring(0, 10) : '',
    assigneeId: task?.assigneeId ?? '',
  })
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)

  const update = (patch) => setForm((f) => ({ ...f, ...patch }))

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setSaving(true)
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim() || null,
        status: form.status,
        priority: form.priority,
        dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : null,
      }
      // Assignee is editable only by admins (who get `people`); the page persists the change.
      if (people.length > 0) {
        payload.assigneeId = form.assigneeId
      }
      await onSubmit(payload)
      onClose()
    } catch (err) {
      // Surface the first server validation message if present.
      const errors = err.response?.data?.errors
      setError(errors ? Object.values(errors).flat()[0] : 'Could not save the task.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>{task ? 'Edit task' : 'New task'}</h2>
        <form onSubmit={handleSubmit} className="form">
          <label className="form__label">
            Title
            <input
              className="input"
              value={form.title}
              maxLength={200}
              autoFocus
              required
              onChange={(e) => update({ title: e.target.value })}
            />
          </label>

          <label className="form__label">
            Description
            <textarea
              className="input"
              rows={3}
              maxLength={1000}
              value={form.description}
              onChange={(e) => update({ description: e.target.value })}
            />
          </label>

          <div className="form__row">
            <label className="form__label">
              Status
              <select className="input" value={form.status} onChange={(e) => update({ status: e.target.value })}>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                ))}
              </select>
            </label>

            <label className="form__label">
              Priority
              <select className="input" value={form.priority} onChange={(e) => update({ priority: e.target.value })}>
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </label>

            <label className="form__label">
              Due date
              <input
                className="input"
                type="date"
                value={form.dueDate}
                onChange={(e) => update({ dueDate: e.target.value })}
              />
            </label>
          </div>

          {people.length > 0 ? (
            // Admins choose the assignee; the page persists the change via the assign endpoint.
            <label className="form__label">
              Assignee
              <select
                className="input"
                value={form.assigneeId}
                onChange={(e) => update({ assigneeId: e.target.value })}
              >
                <option value="">{task ? 'Unassigned' : 'Assign to me'}</option>
                {people.map((p) => (
                  <option key={p.id} value={p.id}>{p.displayName}</option>
                ))}
              </select>
            </label>
          ) : (
            // Regular users see who the task is assigned to, but cannot change it.
            task && (
              <label className="form__label">
                Assignee
                <input className="input" value={task.assigneeName ?? 'Unassigned'} disabled readOnly />
              </label>
            )
          )}

          {task && (
            <p className="form__hint">
              Created {new Date(task.createdAt).toLocaleString()}
              {task.updatedAt && <> · Updated {new Date(task.updatedAt).toLocaleString()}</>}
            </p>
          )}

          {error && <p className="form__error">{error}</p>}

          <div className="form__actions">
            <button type="button" className="btn btn--ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn--primary" disabled={saving}>
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
