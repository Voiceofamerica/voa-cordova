
import { Action } from 'redux'
import Category from 'types/Category'

export const type = 'PLAY_MEDIA'

interface PlayMediaOptions {
  mediaUrl: string
  mediaTitle: string
  mediaDescription: string
}

export type PlayMediaAction = PlayMediaOptions & Action

export default (options: PlayMediaOptions): PlayMediaAction => ({
  ...options,
  type,
})
