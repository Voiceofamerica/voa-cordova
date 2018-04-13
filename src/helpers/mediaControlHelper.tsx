
import { Observable } from 'rxjs/Observable'
import { ReplaySubject } from 'rxjs/ReplaySubject'
import * as MediaControls from 'cordova-plugin-music-controls/www/MusicControls'
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
    MediaControls.create(
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
    MediaControls.destroy(
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
    MediaControls.updateIsPlaying(playing, resolve, reject)
  }))
}
export const play = () => setPlaying(true)

export const pause = () => setPlaying(false)

const baseEventObservable = new Observable<MediaControls.SubscribeEvents>(sub => {
  deviceIsReady.then(() => {
    MediaControls.subscribe((event) => {
      const message: MediaControls.SubscribeEvents = JSON.parse(event).message
      sub.next(message)
    })
    MediaControls.listen()
  }).catch()
})

export const eventObservable = new ReplaySubject(1)
baseEventObservable.subscribe(eventObservable)
