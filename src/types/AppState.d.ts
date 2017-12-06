
import { RouterState } from 'react-router-redux'
import AppSettings from './AppSettings'

export default interface AppState {
  settings: AppSettings
  router: RouterState
}
