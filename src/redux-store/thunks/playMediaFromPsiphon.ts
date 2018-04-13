
import { Dispatch } from 'redux'
import { Subscription } from 'rxjs/Subscription'
import 'rxjs/add/operator/filter'
import 'rxjs/add/operator/map'
import AppState from 'types/AppState'

import { showControls } from 'helpers/mediaControlHelper'
import { portObservable, startObservable } from 'helpers/psiphon'
import playMedia from '../actions/playMedia'
import toggleMediaDrawer from '../actions/toggleMediaDrawer'

let psiphonStartSubscription: Subscription
let portSubscription: Subscription

interface PlayMediaOptions {
  mediaUrl: string
  mediaTitle: string
  mediaDescription: string
  isVideo: boolean
  imageUrl?: string
}

export default (options: PlayMediaOptions) =>
  (dispatch: Dispatch<AppState>, getState: () => AppState) => {
    dispatch(toggleMediaDrawer({ open: true }))
    let alreadyRunning = false
    let playing = false

    const {
      mediaUrl: originalMediaUrl,
    } = options

    const state = getState()
    if (state.media.originalMediaUrl === originalMediaUrl) {
      return
    }

    if (psiphonStartSubscription) {
      psiphonStartSubscription.unsubscribe()
    }

    showControls({
      title: options.mediaTitle,
      playing: true,
    })

    psiphonStartSubscription = startObservable.subscribe(psiphonRunning => {
      if (alreadyRunning && psiphonRunning) {
        return
      }

      alreadyRunning = psiphonRunning
      if (portSubscription && !alreadyRunning) {
        portSubscription.unsubscribe()
      }

      if (typeof device === 'undefined' || device.platform !== 'iOS' || !psiphonRunning) {
        dispatch(playMedia({
          ...options,
          originalMediaUrl,
          keepLocation: playing,
        }))
        playing = true
        return
      }

      const encodedUrl = encodeURIComponent(originalMediaUrl)

      portSubscription = portObservable
        .filter(port => port !== null)
        .map(portNum => `http://127.0.0.1:${portNum}/tunneled-rewrite/${encodedUrl}?m3u8=true`)
        .subscribe(mediaUrl => {
          dispatch(playMedia({
            ...options,
            mediaUrl,
            originalMediaUrl,
            keepLocation: playing,
          }))
          playing = true
        })
    })
  }
