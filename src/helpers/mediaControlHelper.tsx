
import { Observable } from 'rxjs/Observable'
import { ReplaySubject } from 'rxjs/ReplaySubject'
import { MusicControls, SubscribeEventMessage } from '@voiceofamerica/cordova-plugin-music-controls'
import { isIos } from './platform'
import { deviceIsReady, appClosing } from './cordova'

export interface ShowControlsOptions {
  title: string
  playing: boolean
}

let showingControls = false

export const showControls = ({ title, playing }: ShowControlsOptions): Promise<void> => {
  if (isIos()) {
    return Promise.resolve()
  }

  return deviceIsReady.then(() => new Promise<void>((resolve, reject) => {
    MusicControls.create(
      {
        track: title,
        isPlaying: playing,
        hasPrev: false,
        hasNext: false,
        hasClose: true,
      },
      () => {
        showingControls = true
        resolve()
      },
      reject,
    )
  }))
}

export const updateControls = showControls

export const hideControls = (): Promise<void> => {
  if (isIos()) {
    return Promise.resolve()
  }
  return deviceIsReady.then(() => new Promise<void>((resolve, reject) => {
    MusicControls.destroy(
      () => {
        showingControls = false
        resolve()
      },
      reject,
    )
  }))
}

appClosing.then(() => hideControls())
  .catch(() => null)

export const setPlaying = (playing: boolean): Promise<void> => {
  if (isIos() || !showingControls) {
    return Promise.resolve()
  }
  return deviceIsReady.then(() => new Promise<void>((resolve, reject) => {
    MusicControls.updateIsPlaying(playing, resolve, reject)
  }))
}
export const play = () => setPlaying(true)

export const pause = () => setPlaying(false)

const baseEventObservable = new Observable<SubscribeEventMessage>(sub => {
  deviceIsReady.then(() => {
    MusicControls.subscribe((event) => {
      sub.next(event.message)
    })
    MusicControls.listen()
  }).catch()
})

export const eventObservable = new ReplaySubject(1)
baseEventObservable.subscribe(eventObservable)
