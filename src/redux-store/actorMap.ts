
import { Action, Reducer } from 'redux'

export interface ActorMap<S> {
  [name: string]: Reducer<S>
}

export function buildReducer<S> (initialState: S, map: ActorMap<S>): Reducer<S> {
  return (prev: S = initialState, action: Action): S => {
    let actor = map[action.type]
    return typeof actor === 'function' ? actor(prev, action) : prev
  }
}

export function buildArrayReducer<S, I> (idSelector: (item: S) => I, childReducer: Reducer<S>): Reducer<S[]> {
  return (prev, action: Action & { id: I }) => {
    return prev.map(item => {
      if (idSelector(item) === action.id) {
        return childReducer(item, action)
      } else {
        return item
      }
    })
  }
}
