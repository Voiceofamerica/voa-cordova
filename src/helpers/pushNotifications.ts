
import { Observable } from 'rxjs/Observable'
import { ReplaySubject } from 'rxjs/ReplaySubject'

export interface NotificationInit {
  push: PhonegapPluginPush.PushNotification
  notificationObservable: Observable<PhonegapPluginPush.NotificationEventResponse>
}

const notificationSubject = new ReplaySubject<PhonegapPluginPush.NotificationEventResponse>(1)

function initialize (): NotificationInit {
  const push = PushNotification.init({
    android: {
      senderID: undefined,
    },
    ios: {
    },
  })

  push.on('registration', (data) => {
    console.log('Push notification registration id:', data.registrationId)
  })

  new Observable<PhonegapPluginPush.NotificationEventResponse>((sub) => {
    push.on('notification', (data) => sub.next(data))
  }).subscribe(notificationSubject)

  push.on('error', (e) => {
    console.error('Notification error:', e)
  })

  return {
    push,
    notificationObservable: notificationSubject,
  }
}

export const initPromise = new Promise<NotificationInit>((resolve) => {
  document.addEventListener('deviceready', () => {
    resolve(initialize())
  })
})
