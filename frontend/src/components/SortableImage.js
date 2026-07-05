import { useSortable } from '@dnd-kit/react/sortable'

export default function SortableImage({ id, index, children }) {
  const { ref, isDragging } = useSortable({ id, index })

  return (
    <div
      ref={ref}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: 'grab',
      }}
    >
      {children}
    </div>
  )
}