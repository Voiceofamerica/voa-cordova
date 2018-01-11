
import { Dispatch } from 'redux'
import { Moment } from 'moment'
import AppState from 'types/AppState'

import toggleNotification from '../actions/toggleNotification'

export const type = 'PLAY_MEDIA'

interface ToggleNotifierOptions {
  id: string
  title?: string
  time?: Moment
  on?: boolean
}

export default (options: ToggleNotifierOptions) =>
  (dispatch: Dispatch<AppState>, getState: () => AppState) => {
    const { id, on = !getState().notifications[id], title, time } = options

    const setNotification = () => {
      const trigger = time ? {
        at: time.toDate(),
      } : undefined

      if (on) {
        cordova.plugins.notification.local.schedule({
          id,
          title,
          trigger,
        }, (ret) => {
          console.log(ret)
          dispatch(toggleNotification({ id, on }))
        })
      } else {
        cordova.plugins.notification.local.cancel([id], (ret) => {
          console.log(ret)
          dispatch(toggleNotification({ id, on }))
        })
      }
    }

    cordova.plugins.notification.local.hasPermission((hasPermission) => {
      if (!hasPermission) {
        cordova.plugins.notification.local.requestPermission((allowed) => {
          if (allowed) {
            setNotification()
          }
        })
      } else {
        setNotification()
      }
    })
  }
