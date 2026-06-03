// Enum values mirror the backend TaskItemStatus / TaskPriority enums (serialised as strings).
export const STATUSES = ['Todo', 'InProgress', 'InReview', 'Done']
export const PRIORITIES = ['Low', 'Medium', 'High']

// Human-friendly labels for each status.
export const STATUS_LABELS = {
  Todo: 'To Do',
  InProgress: 'In Progress',
  InReview: 'In Review',
  Done: 'Done',
}

// Ordered list of Kanban columns, left to right.
export const BOARD_COLUMNS = STATUSES

// Text colors used to convey priority/status at a glance (e.g. in the task form dropdowns).
export const PRIORITY_COLORS = {
  Low: '#2563eb',     // blue
  Medium: '#d97706',  // amber
  High: '#dc2626',    // red
}
export const STATUS_COLORS = {
  Todo: '#475569',       // slate
  InProgress: '#1d4ed8', // blue
  InReview: '#6d28d9',   // purple
  Done: '#15803d',       // green
}
