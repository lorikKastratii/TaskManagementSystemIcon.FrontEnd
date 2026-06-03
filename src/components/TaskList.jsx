import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import TaskCard from './TaskCard'

// Renders the draggable, reorderable list of tasks.
export default function TaskList({ tasks, onReorder, onToggle, onEdit, onDelete, onAssign, people = [] }) {
  function handleDragEnd(result) {
    if (!result.destination || result.destination.index === result.source.index) return
    const reordered = Array.from(tasks)
    const [moved] = reordered.splice(result.source.index, 1)
    reordered.splice(result.destination.index, 0, moved)
    onReorder(reordered)
  }

  if (tasks.length === 0) {
    return <p className="empty">No tasks match your filters. Create one to get started.</p>
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="tasks">
        {(provided) => (
          <div className="list" ref={provided.innerRef} {...provided.droppableProps}>
            {tasks.map((task, index) => (
              <Draggable key={task.id} draggableId={task.id} index={index}>
                {(dragProvided, snapshot) => (
                  <div
                    ref={dragProvided.innerRef}
                    {...dragProvided.draggableProps}
                    className={snapshot.isDragging ? 'list__item list__item--dragging' : 'list__item'}
                  >
                    <TaskCard
                      task={task}
                      onToggle={onToggle}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onAssign={onAssign}
                      people={people}
                      dragHandleProps={dragProvided.dragHandleProps}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}
