
import {
  type as playMediaType,
  PlayMediaAction,
} from '../actions/playMedia'

import {
  type as toggleMediaDrawerType,
  ToggleMediaDrawerAction,
} from '../actions/toggleMediaDrawer'

import { ActorMap, buildReducer } from '../actorMap'
import MediaState from 'types/MediaState'

const actors: ActorMap<MediaState> = {
  [playMediaType]: (prev, { mediaUrl, originalMediaUrl, mediaTitle, mediaDescription, imageUrl = null }: PlayMediaAction) => ({
    ...prev,
    mediaUrl,
    originalMediaUrl,
    mediaTitle,
    mediaDescription,
    imageUrl,
    mediaOpen: true,
  }),
  [toggleMediaDrawerType]: (prev, { open: mediaOpen = !prev.mediaOpen }: ToggleMediaDrawerAction) => ({
    ...prev,
    mediaOpen,
  }),
}

export const INITIAL_STATE: MediaState = {
  mediaOpen: false,
}

export default buildReducer(INITIAL_STATE, actors)
