
import { combineReducers, Reducer } from 'redux'
import { routerReducer } from 'react-router-redux'

import AppState from 'types/AppState'

import appSettingsReducer from './reducers/appSettingsReducer'
import mediaStateReducer from './reducers/mediaStateReducer'
import favoriteContentsReducer from './reducers/favoriteContentsReducer'

const rootReducer: Reducer<AppState> = combineReducers({
  settings: appSettingsReducer,
  media: mediaStateReducer,
  favorites: favoriteContentsReducer,
  router: routerReducer,
})

export default rootReducer
