import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import TaskCard from './TaskCard'
import { BOARD_COLUMNS, STATUS_LABELS } from '../constants'

// Kanban board: one lane per status. Dragging a card to another lane changes its status;
// dragging within a lane reorders it. The parent persists both via `onMove`.
export default function TaskBoard({ tasks, onMove, onToggle, onOpen, onDelete }) {
  // Group tasks into columns, preserving the incoming (SortOrder) order within each lane.
  const columns = BOARD_COLUMNS.map((status) => ({
    status,
    items: tasks.filter((t) => t.status === status),
  }))

  function handleDragEnd(result) {
    const { source, destination, draggableId } = result
    if (!destination) return
    if (source.droppableId === destination.droppableId && source.index === destination.index) return

    const task = tasks.find((t) => t.id === draggableId)
    if (!task) return

    // Rebuild each lane's id list, move the dragged id, then flatten in column order to get the
    // new global ordering the reorder endpoint expects.
    const lanes = Object.fromEntries(
      BOARD_COLUMNS.map((status) => [status, tasks.filter((t) => t.status === status).map((t) => t.id)]),
    )
    lanes[source.droppableId].splice(source.index, 1)
    lanes[destination.droppableId].splice(destination.index, 0, draggableId)
    const orderedIds = BOARD_COLUMNS.flatMap((status) => lanes[status])

    onMove(task, destination.droppableId, orderedIds)
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="board">
        {columns.map(({ status, items }) => (
          <div className="board__col" key={status}>
            <div className="board__col-header">
              <span>{STATUS_LABELS[status]}</span>
              <span className="board__count">{items.length}</span>
            </div>

            <Droppable droppableId={status}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`board__dropzone ${snapshot.isDraggingOver ? 'board__dropzone--over' : ''}`}
                >
                  {items.map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(dragProvided, dragSnapshot) => (
                        <div
                          ref={dragProvided.innerRef}
                          {...dragProvided.draggableProps}
                          {...dragProvided.dragHandleProps}
                          className={dragSnapshot.isDragging ? 'list__item list__item--dragging' : 'list__item'}
                        >
                          <TaskCard
                            task={task}
                            onToggle={onToggle}
                            onOpen={onOpen}
                            onDelete={onDelete}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                  {items.length === 0 && !snapshot.isDraggingOver && (
                    <p className="board__empty">Drop tasks here</p>
                  )}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  )
}
