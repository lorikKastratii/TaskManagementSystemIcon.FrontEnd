import api from './api'

// Aggregate task statistics for the dashboard (counts, breakdowns, per-user tallies).
export const dashboardService = {
  stats: () => api.get('/dashboard/stats').then((r) => r.data),
}
