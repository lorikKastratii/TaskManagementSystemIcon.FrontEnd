import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import TaskFilters from '../components/TaskFilters'
import TaskList from '../components/TaskList'
import TaskForm from '../components/TaskForm'
import { useTasks } from '../context/TaskContext'
import { useAuth } from '../context/AuthContext'

export default function TasksPage() {
  const { isAdmin } = useAuth()
  const {
    tasks, people, filters, loading, error,
    setFilters, loadTasks, loadPeople, createTask, updateTask, toggleComplete, deleteTask, assignTask, reorderTasks,
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

  const submit = (payload) =>
    editing ? updateTask(editing.id, payload) : createTask(payload)

  const remaining = tasks.filter((t) => !t.isCompleted).length

  return (
    <div className="page">
      <Navbar />
      <main className="container">
        <div className="page__header">
          <div>
            <h1 className="page__title">{isAdmin ? 'All tasks' : 'Your tasks'}</h1>
            <p className="page__subtitle">{remaining} active · {tasks.length} total</p>
          </div>
          <button className="btn btn--primary" onClick={openCreate}>+ New task</button>
        </div>

        <TaskFilters filters={filters} onChange={setFilters} people={people} />

        {error && <p className="form__error">{error}</p>}
        {loading ? (
          <p className="empty">Loading…</p>
        ) : (
          <TaskList
            tasks={tasks}
            onReorder={reorderTasks}
            onToggle={toggleComplete}
            onEdit={openEdit}
            onDelete={handleDelete}
            onAssign={assignTask}
            people={people}
          />
        )}
      </main>

      {showForm && (
        <TaskForm task={editing} onSubmit={submit} onClose={() => setShowForm(false)} people={people} />
      )}
    </div>
  )
}
