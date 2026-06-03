import api from './api'

// Maps UI filter state to query-string params, omitting empty values.
function toParams(filters = {}) {
  const params = {}
  if (filters.status) params.status = filters.status
  if (filters.priority) params.priority = filters.priority
  if (filters.isCompleted !== undefined && filters.isCompleted !== '') params.isCompleted = filters.isCompleted
  if (filters.search) params.search = filters.search
  return params
}

export const taskService = {
  list: (filters) => api.get('/tasks', { params: toParams(filters) }).then((r) => r.data),
  create: (payload) => api.post('/tasks', payload).then((r) => r.data),
  update: (id, payload) => api.put(`/tasks/${id}`, payload).then((r) => r.data),
  setCompletion: (id, isCompleted) =>
    api.patch(`/tasks/${id}/complete`, null, { params: { isCompleted } }).then((r) => r.data),
  reorder: (orderedTaskIds) => api.put('/tasks/reorder', { orderedTaskIds }),
  remove: (id) => api.delete(`/tasks/${id}`),
}
