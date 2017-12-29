
import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import { routerMiddleware } from 'react-router-redux'
import { persistStore, autoRehydrate } from 'redux-persist'

import history from 'containers/Router/history'
import rootReducer from './rootReducer'

const store = createStore(
  rootReducer,
  compose(
    applyMiddleware(
      routerMiddleware(history),
      thunk,
    ),
    autoRehydrate(),
  ),
)

persistStore(store)

export default store
