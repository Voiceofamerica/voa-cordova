
import { Dispatch } from 'redux'
import AppState from 'types/AppState'

import toggleDailyNotification from '../actions/toggleDailyNotification'
import { scheduleDaily, cancelDaily } from 'helpers/notifications'

interface ToggleNotifierOptions {
  on?: boolean
}

export default (options: ToggleNotifierOptions) =>
  (dispatch: Dispatch<AppState>, getState: () => AppState) => {
    const { on = !getState().settings.dailyNotificationOn } = options

    if (on) {
      scheduleDaily().then((ret) => {
        console.log(ret)
        dispatch(toggleDailyNotification({ on }))
      })
    } else {
      cancelDaily().then((ret) => {
        console.log(ret)
        dispatch(toggleDailyNotification({ on }))
      })
    }
  }
