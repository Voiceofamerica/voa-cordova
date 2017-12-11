
import { RouterState } from 'react-router-redux'
import AppSettings from './AppSettings'
import MediaState from './MediaState'

export default interface AppState {
  settings: AppSettings
  media: MediaState
  router: RouterState
}
