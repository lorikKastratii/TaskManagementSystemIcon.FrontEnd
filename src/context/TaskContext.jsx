import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { taskService } from '../services/taskService'

const TaskContext = createContext(null)

const EMPTY_FILTERS = { status: '', priority: '', isCompleted: '', search: '' }

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([])
  const [filters, setFilters] = useState(EMPTY_FILTERS)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const loadTasks = useCallback(async (activeFilters) => {
    setLoading(true)
    setError(null)
    try {
      setTasks(await taskService.list(activeFilters))
    } catch {
      setError('Failed to load tasks.')
    } finally {
      setLoading(false)
    }
  }, [])

  async function createTask(payload) {
    const created = await taskService.create(payload)
    setTasks((prev) => [...prev, created])
  }

  async function updateTask(id, payload) {
    const updated = await taskService.update(id, payload)
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)))
  }

  async function toggleComplete(task) {
    const updated = await taskService.setCompletion(task.id, !task.isCompleted)
    setTasks((prev) => prev.map((t) => (t.id === task.id ? updated : t)))
  }

  async function deleteTask(id) {
    await taskService.remove(id)
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }

  // Optimistically reorder locally, then persist. Revert on failure.
  async function reorderTasks(reordered) {
    const previous = tasks
    setTasks(reordered)
    try {
      await taskService.reorder(reordered.map((t) => t.id))
    } catch {
      setTasks(previous)
      setError('Failed to save the new order.')
    }
  }

  const value = useMemo(
    () => ({
      tasks,
      filters,
      loading,
      error,
      setFilters,
      loadTasks,
      createTask,
      updateTask,
      toggleComplete,
      deleteTask,
      reorderTasks,
    }),
    [tasks, filters, loading, error, loadTasks],
  )

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTasks() {
  const ctx = useContext(TaskContext)
  if (!ctx) throw new Error('useTasks must be used within a TaskProvider')
  return ctx
}
