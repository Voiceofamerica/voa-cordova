
import { Action } from 'redux'
import Category from 'types/Category'

export const type = 'TOGGLE_MEDIA_PLAYING'

interface ToggleMediaPlayingOptions {
  playing?: boolean
}

export type ToggleMediaPlayingAction = ToggleMediaPlayingOptions & Action

export default (options: ToggleMediaPlayingOptions): ToggleMediaPlayingAction => ({
  ...options,
  type,
})
