
import { createStore, applyMiddleware } from 'redux'
import { routerMiddleware } from 'react-router-redux'

import history from 'containers/Router/history'
import rootReducer from './rootReducer'

const store = createStore(
  rootReducer,
  applyMiddleware(
    routerMiddleware(history),
  ),
)

export default store
