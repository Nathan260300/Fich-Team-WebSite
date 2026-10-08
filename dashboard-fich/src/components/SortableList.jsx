import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import styles from './SortableList.module.css';

function SortableItem({ id, children }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.45 : 1,
    position: 'relative',
    zIndex: isDragging ? 2 : 'auto',
  };
  const handle = (
    <span className={styles.handle} {...attributes} {...listeners} title="Glisser pour réordonner">⠿</span>
  );
  return <div ref={setNodeRef} style={style}>{children(handle)}</div>;
}

export default function SortableList({ items, onReorder, renderItem }) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  const move = (index, delta) => {
    const target = index + delta;
    if (target < 0 || target >= items.length) return;
    onReorder(arrayMove(items, index, target));
  };

  const onDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return;
    const from = items.findIndex(item => item.id === active.id);
    const to = items.findIndex(item => item.id === over.id);
    onReorder(arrayMove(items, from, to));
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext items={items.map(item => item.id)} strategy={verticalListSortingStrategy}>
        <div className={styles.list}>
          {items.map((item, index) => (
            <SortableItem key={item.id} id={item.id}>
              {handle => renderItem(item, {
                index,
                handle,
                isFirst: index === 0,
                isLast: index === items.length - 1,
                moveUp: () => move(index, -1),
                moveDown: () => move(index, 1),
              })}
            </SortableItem>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
