
import { Action } from 'redux'
import Category from 'types/Category'

export const type = 'PLAY_MEDIA'

interface PlayMediaOptions {
  mediaUrl?: string
  originalMediaUrl: string
  mediaTitle: string
  mediaDescription: string
  isVideo: boolean
  imageUrl?: string
}

export type PlayMediaAction = PlayMediaOptions & Action

export default (options: PlayMediaOptions): PlayMediaAction => ({
  ...options,
  type,
})
