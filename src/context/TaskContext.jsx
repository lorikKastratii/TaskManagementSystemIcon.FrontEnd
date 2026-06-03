import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { taskService } from '../services/taskService'
import { userService } from '../services/userService'

const TaskContext = createContext(null)

const EMPTY_FILTERS = { status: '', priority: '', isCompleted: '', search: '', assigneeId: '' }

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([])
  const [people, setPeople] = useState([])
  const [filters, setFilters] = useState(EMPTY_FILTERS)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Admin-only: the set of accounts a task can be assigned to. Loaded once.
  const loadPeople = useCallback(async () => {
    try {
      setPeople(await userService.list())
    } catch {
      // Non-admins get 403 here; silently ignore so the rest of the page still works.
    }
  }, [])

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

  // Admin-only: reassign a task. If a single-assignee filter is active and the task no longer
  // matches it, drop it from the visible list; otherwise update it in place.
  async function assignTask(id, assigneeId) {
    const updated = await taskService.assign(id, assigneeId)
    setTasks((prev) =>
      filters.assigneeId && updated.assigneeId !== filters.assigneeId
        ? prev.filter((t) => t.id !== id)
        : prev.map((t) => (t.id === id ? updated : t)),
    )
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

  // Kanban move: drop a task into a lane (newStatus) at a new position. `orderedIds` is the full
  // visual order across all lanes after the move. Applies optimistically, persists the status
  // change (only if the lane changed) and the new ordering, and reverts on failure.
  async function moveTask(task, newStatus, orderedIds) {
    const previous = tasks
    const byId = new Map(previous.map((t) => [t.id, t]))
    byId.set(task.id, { ...task, status: newStatus, isCompleted: newStatus === 'Done' })
    const next = orderedIds.map((id, index) => ({ ...byId.get(id), sortOrder: index }))
    setTasks(next)
    try {
      if (task.status !== newStatus) {
        await taskService.update(task.id, { status: newStatus })
      }
      await taskService.reorder(orderedIds)
    } catch {
      setTasks(previous)
      setError('Failed to move the task.')
    }
  }

  const value = useMemo(
    () => ({
      tasks,
      people,
      filters,
      loading,
      error,
      setFilters,
      loadTasks,
      loadPeople,
      createTask,
      updateTask,
      toggleComplete,
      deleteTask,
      assignTask,
      reorderTasks,
      moveTask,
    }),
    [tasks, people, filters, loading, error, loadTasks, loadPeople],
  )

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTasks() {
  const ctx = useContext(TaskContext)
  if (!ctx) throw new Error('useTasks must be used within a TaskProvider')
  return ctx
}
