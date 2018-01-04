
import * as React from 'react'
import {
  DragSource,
  DropTarget,
  DragElementWrapper,
  DragSourceOptions,
  ConnectDropTarget,
} from 'react-dnd'

import { pillOuter, pill, dragged } from './CategorySettings.scss'

type DragHandler = (self: PillItem, over: PillItem) => void

interface Props extends React.Props<any> {
  itemId: number
  index: number
  cardType: string
  draggedOver: DragHandler
  connectDragSource?: DragElementWrapper<DragSourceOptions>
  connectDropTarget?: ConnectDropTarget
  isDragging?: boolean
}

export interface PillItem {
  id: number
  type: string
  index: number
  draggedOver: DragHandler
}

const CategoryPill = ({ children, connectDragSource, isDragging, connectDropTarget }: Props) => {
  const className = isDragging ? `${pill} ${dragged}` : pill

  return connectDropTarget((
    <div className={pillOuter}>
      {
        connectDragSource((
          <div className={className}>
            {children}
          </div>
        ))
      }
    </div>
  ))
}

function getItem (props: Props): PillItem {
  return {
    id: props.itemId,
    type: props.cardType,
    index: props.index,
    draggedOver: props.draggedOver,
  }
}

const draggable = DragSource(
  (props: Props) => props.cardType,
  {
    beginDrag: getItem,
  },
  (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  }),
)

const dropArea = DropTarget(
  (props: Props) => props.cardType,
  {
    hover (props, monitor) {
      const item = monitor.getItem() as PillItem
      const dragId = item.id
      const hoverId = props.itemId

      if (dragId === hoverId) {
        return
      }

      props.draggedOver(item, getItem(props))
    },
  },
  connect => ({
    connectDropTarget: connect.dropTarget(),
  }),
)

export default dropArea(draggable(CategoryPill))
