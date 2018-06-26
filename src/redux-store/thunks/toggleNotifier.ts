import { Dispatch } from 'redux'
import AppState from 'types/AppState'

import toggleDailyNotification from '../actions/toggleDailyNotification'
import { subscribeToTopic, unsubscribeFromTopic } from 'helpers/pushNotifications'

interface ToggleNotifierOptions {
  on: boolean
  topic: string
}

export default (options: ToggleNotifierOptions) => (dispatch: Dispatch<AppState>) => {
  const { on, topic } = options

  if (on) {
    subscribeToTopic(topic).subscribe(success => {
      dispatch(
        toggleDailyNotification({
          on: success,
        }),
      )
    })
  } else {
    unsubscribeFromTopic(topic).subscribe(success => {
      dispatch(
        toggleDailyNotification({
          on: !success,
        }),
      )
    })
  }
}
