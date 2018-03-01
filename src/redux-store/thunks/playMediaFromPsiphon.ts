
import { Dispatch } from 'redux'
import AppState from 'types/AppState'

import { port } from 'helpers/psiphon'
import playMedia from '../actions/playMedia'
import toggleMediaDrawer from '../actions/toggleMediaDrawer'

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

    const {
      mediaUrl: originalMediaUrl,
    } = options

    const state = getState()
    if (state.media.originalMediaUrl === originalMediaUrl) {
      return Promise.resolve()
    }

    if (typeof device === 'undefined' || device.platform !== 'iOS') {
      dispatch(playMedia({
        ...options,
        originalMediaUrl,
      }))
      return Promise.resolve()
    }

    const encodedUrl = encodeURIComponent(originalMediaUrl)
    return port()
      .then(portNum => `http://127.0.0.1:${portNum}/tunneled-rewrite/${encodedUrl}?m3u8=true`)
      .then(mediaUrl => {
        dispatch(playMedia({
          ...options,
          mediaUrl,
          originalMediaUrl,
        }))
      })
  }
