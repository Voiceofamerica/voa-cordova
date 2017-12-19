
import { Action, Dispatch } from 'redux'
import AppState from 'types/AppState'

import playMedia from '../actions/playMedia'
import toggleMediaDrawer from '../actions/toggleMediaDrawer'

export const type = 'PLAY_MEDIA'

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
      mediaTitle,
      mediaDescription,
      imageUrl,
      isVideo,
    } = options

    const state = getState()
    if (state.media.originalMediaUrl === originalMediaUrl) {
      return
    }

    dispatch(playMedia({
      mediaUrl: originalMediaUrl,
      originalMediaUrl,
      mediaTitle,
      mediaDescription,
      isVideo,
      imageUrl,
    }))

    // return fetch(originalMediaUrl)
    //   .then(res => res.blob())
    //   .then(blob => URL.createObjectURL(blob))
    //   .then(mediaUrl => {
    //     dispatch(playMedia({
    //       ...options,
    //       mediaUrl,
    //       originalMediaUrl,
    //     }))
    //   })
  }
