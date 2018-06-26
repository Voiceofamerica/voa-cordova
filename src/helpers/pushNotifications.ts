import { Observable } from 'rxjs/Observable'
import { ReplaySubject } from 'rxjs/ReplaySubject'
import { of } from 'rxjs/observable/of'

export const notificationSubject = new ReplaySubject<
  PhonegapPluginPush.NotificationEventResponse
>(1)

let push: PhonegapPluginPush.PushNotification = null

export enum NotificationStatus {
  initialized,
  subscribed,
  failed,
}

function initialize(topic?: string): Observable<boolean> {
  push = PushNotification.init({
    android: {
      senderID: '240913753196',
    },
    ios: {
      alert: 'true',
      badge: 'true',
      sound: 'true',
    },
  })

  push.on('registration', data => {
    console.log('Push notification registration id:', data.registrationId)
  })
  push.on('notification', handleNotification)
  push.on('error', e => console.error('Notification error:', e))

  return subscribeToTopic(topic)
}

function handleNotification(data: PhonegapPluginPush.NotificationEventResponse) {
  notificationSubject.next(data)
  push.finish(
    () => {
      console.log('processing of push data is finished')
    },
    () => {
      console.log(
        'something went wrong with push.finish for ID =',
        data.additionalData.notId,
      )
    },
    data.additionalData.notId,
  )
}

export function subscribeToTopic(topic: string): Observable<boolean> {
  const subscribeObservable = new ReplaySubject<boolean>()

  if (topic) {
    push.subscribe(
      topic,
      () => {
        console.log('success subscribing to topic')
        subscribeObservable.next(true)
      },
      () => {
        console.log('error subscribing to topic')
        subscribeObservable.next(false)
      },
    )
  } else {
    return of(false)
  }

  return subscribeObservable
}

export function unsubscribeFromTopic(topic: string) {
  const unsubscribeObservable = new ReplaySubject<boolean>()

  if (topic) {
    push.unsubscribe(
      topic,
      () => {
        console.log('success subscribing to topic')
        unsubscribeObservable.next(true)
      },
      () => {
        console.log('error subscribing to topic')
        unsubscribeObservable.next(false)
      },
    )
  } else {
    return of(false)
  }

  return unsubscribeObservable
}

export function initializeNotifications(topic?: string): Observable<NotificationStatus> {
  const initilizationObservable = new ReplaySubject<NotificationStatus>()

  if (push === null) {
    document.addEventListener('deviceready', () => {
      initialize(topic).subscribe(status =>
        initilizationObservable.next(
          status ? NotificationStatus.subscribed : NotificationStatus.failed,
        ),
      )
    })
  } else {
    return of(NotificationStatus.initialized)
  }

  return initilizationObservable
}
