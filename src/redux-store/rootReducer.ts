
import { combineReducers, Reducer } from 'redux'
import { routerReducer } from 'react-router-redux'

import AppState from 'types/AppState'

import appSettingsReducer from './reducers/appSettingsReducer'

const rootReducer: Reducer<AppState> = combineReducers({
  settings: appSettingsReducer,
  router: routerReducer,
})

export default rootReducer
