
import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import { routerMiddleware } from 'react-router-redux'
import { persistStore, autoRehydrate } from 'redux-persist'

import history from 'containers/Router/history'
import AppState from 'types/AppState'
import rootReducer from './rootReducer'

export let renderReady = false
const readyCallbacks: (() => void)[] = []
export function onRenderReady (cb: () => void) {
  if (renderReady) {
    cb()
  } else {
    readyCallbacks.push(cb)
  }
}

const store = createStore<AppState>(
  rootReducer,
  compose(
    applyMiddleware(
      routerMiddleware(history),
      thunk,
    ),
    autoRehydrate({}),
  ) as any,
)

persistStore(store, {
  blacklist: ['media'],
}, () => {
  renderReady = true
  readyCallbacks.forEach(cb => cb())
})

export default store
