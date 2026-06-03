import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import TaskFilters from '../components/TaskFilters'
import TaskBoard from '../components/TaskBoard'
import TaskForm from '../components/TaskForm'
import { useTasks } from '../context/TaskContext'
import { useAuth } from '../context/AuthContext'

export default function TasksPage() {
  const { isAdmin } = useAuth()
  const {
    tasks, people, filters, loading, error,
    setFilters, loadTasks, loadPeople, createTask, updateTask, toggleComplete, deleteTask, assignTask, moveTask,
  } = useTasks()

  const [editing, setEditing] = useState(null) // task being edited
  const [showForm, setShowForm] = useState(false)

  // Reload whenever filters change, debounced so typing in search doesn't spam the API.
  useEffect(() => {
    const handle = setTimeout(() => loadTasks(filters), 250)
    return () => clearTimeout(handle)
  }, [filters, loadTasks])

  // Admins load the list of assignable people once for the filter/picker/reassign controls.
  useEffect(() => {
    if (isAdmin) loadPeople()
  }, [isAdmin, loadPeople])

  function openCreate() {
    setEditing(null)
    setShowForm(true)
  }

  function openEdit(task) {
    setEditing(task)
    setShowForm(true)
  }

  async function handleDelete(task) {
    if (window.confirm(`Delete “${task.title}”?`)) {
      await deleteTask(task.id)
    }
  }

  // On save: create includes the assignee directly; edit updates the fields and, if an admin
  // changed the assignee, persists that separately via the assign endpoint.
  async function submit(payload) {
    if (!editing) {
      await createTask(payload)
      return
    }
    const { assigneeId, ...fields } = payload
    await updateTask(editing.id, fields)
    if (isAdmin && (assigneeId ?? '') !== (editing.assigneeId ?? '')) {
      await assignTask(editing.id, assigneeId || null)
    }
  }

  const remaining = tasks.filter((t) => !t.isCompleted).length

  return (
    <div className="page">
      <Navbar />
      <main className="container container--wide">
        <div className="page__header">
          <div>
            <h1 className="page__title">All tasks</h1>
            <p className="page__subtitle">{remaining} active · {tasks.length} total</p>
          </div>
          <button className="btn btn--primary" onClick={openCreate}>+ New task</button>
        </div>

        <TaskFilters filters={filters} onChange={setFilters} people={people} />

        {error && <p className="form__error">{error}</p>}
        {loading ? (
          <p className="empty">Loading…</p>
        ) : (
          <TaskBoard
            tasks={tasks}
            onMove={moveTask}
            onToggle={toggleComplete}
            onOpen={openEdit}
            onDelete={handleDelete}
          />
        )}
      </main>

      {showForm && (
        <TaskForm task={editing} onSubmit={submit} onClose={() => setShowForm(false)} people={people} />
      )}
    </div>
  )
}
