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
