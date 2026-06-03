import api from './api'

// Maps UI filter state to query-string params, omitting empty values.
function toParams(filters = {}) {
  const params = {}
  if (filters.status) params.status = filters.status
  if (filters.priority) params.priority = filters.priority
  if (filters.isCompleted !== undefined && filters.isCompleted !== '') params.isCompleted = filters.isCompleted
  if (filters.search) params.search = filters.search
  if (filters.assigneeId) params.assigneeId = filters.assigneeId
  return params
}

export const taskService = {
  list: (filters) => api.get('/tasks', { params: toParams(filters) }).then((r) => r.data),
  create: (payload) => api.post('/tasks', payload).then((r) => r.data),
  update: (id, payload) => api.put(`/tasks/${id}`, payload).then((r) => r.data),
  setCompletion: (id, isCompleted) =>
    api.patch(`/tasks/${id}/complete`, null, { params: { isCompleted } }).then((r) => r.data),
  reorder: (orderedTaskIds) => api.put('/tasks/reorder', { orderedTaskIds }),
  // Admin-only: (re)assign a task. Pass null/'' to unassign.
  assign: (id, assigneeId) =>
    api.patch(`/tasks/${id}/assign`, null, { params: assigneeId ? { assigneeId } : {} }).then((r) => r.data),
  remove: (id) => api.delete(`/tasks/${id}`),
}
