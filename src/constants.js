// Enum values mirror the backend TaskItemStatus / TaskPriority enums (serialised as strings).
export const STATUSES = ['Todo', 'InProgress', 'Done']
export const PRIORITIES = ['Low', 'Medium', 'High']

// Human-friendly labels for the InProgress status.
export const STATUS_LABELS = {
  Todo: 'To Do',
  InProgress: 'In Progress',
  Done: 'Done',
}
