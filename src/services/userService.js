import api from './api'

// Admin-only directory of accounts used to populate the assignee picker and filter.
export const userService = {
  list: () => api.get('/users').then((r) => r.data),
}
