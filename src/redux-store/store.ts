
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { routerMiddleware } from 'react-router-redux'

import history from 'containers/Router/history'
import rootReducer from './rootReducer'

const store = createStore(
  rootReducer,
  applyMiddleware(
    routerMiddleware(history),
    thunk,
  ),
)

export default store
