
import * as React from 'react'
import {
  DragSource,
  DropTarget,
  DragElementWrapper,
  DragSourceOptions,
  ConnectDropTarget,
  ClientOffset,
} from 'react-dnd'

import { pillOuter, pill, dragged } from './CategorySettings.scss'

export const DRAG_DELAY = 150

type DragHandler = (self: PillItem, over: PillItem) => void

interface Props extends React.Props<any> {
  itemId: number
  index: number
  cardType: string
  draggedOver: DragHandler
  connectDragSource?: DragElementWrapper<DragSourceOptions>
  connectDropTarget?: ConnectDropTarget
  isDragging?: boolean
  clientOffset?: ClientOffset
  sourceOffset?: ClientOffset
}

interface State {
  touched: boolean
}

export interface PillItem {
  id: number
  type: string
  index: number
  draggedOver: DragHandler
}

class CategoryPill extends React.Component<Props> {
  state: State = {
    touched: false,
  }

  timerId: any

  onTouchStart = () => {
    this.timerId = setTimeout(() => {
      this.toggleTouched(true)
    }, DRAG_DELAY)
  }

  onTouchEnd = () => {
    clearTimeout(this.timerId)
    this.toggleTouched(false)
  }

  toggleTouched = (touched: boolean) =>
    this.setState({ touched })

  render () {
    const { children, connectDragSource, isDragging, clientOffset, sourceOffset, connectDropTarget } = this.props
    const { touched } = this.state

    const className = touched ? `${pill} ${dragged}` : pill
    const left = isDragging && clientOffset && sourceOffset ? sourceOffset.x : 0
    const top = isDragging && clientOffset && sourceOffset ? sourceOffset.y : 0
    const pointerEvents = isDragging ? 'none' : 'auto'

    return connectDropTarget((
      <div className={pillOuter}>
        {
          connectDragSource((
            <div
              className={className}
              style={{ left, top, pointerEvents }}
              onTouchStart={this.onTouchStart}
              onTouchEnd={this.onTouchEnd}
            >
              {children}
            </div>
          ))
        }
      </div>
    ))
  }
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
    clientOffset: monitor.getClientOffset(),
    sourceOffset: monitor.getSourceClientOffset(),
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
