
import {
  type as setCategoryOrderType,
  SetCategoryAction,
} from '../actions/setCategoryOrder'

import {
  type as setMediaPlaybackRateType,
  SetMediaPlaybackRateAction,
} from '../actions/setMediaPlaybackRate'

import { ActorMap, buildReducer } from '../actorMap'
import AppSettings from 'types/AppSettings'

const actors: ActorMap<AppSettings> = {
  [setCategoryOrderType]: (prev, { categories }: SetCategoryAction) => ({
    ...prev,
    categories,
  }),
  [setMediaPlaybackRateType]: (prev, { mediaPlaybackRate }: SetMediaPlaybackRateAction) => ({
    ...prev,
    mediaPlaybackRate,
  }),
}

export const INITIAL_STATE: AppSettings = {
  categories: [
    {
      id: 1757,
      name: '中国',
    },
    {
      id: 1746,
      name: '美国',
    },
    {
      id: 1745,
      name: '亚太',
    },
    {
      id: 1904,
      name: '时事大家谈',
    },
    {
      id: 1769,
      name: '台湾',
    },
    {
      id: 1755,
      name: '港澳',
    },
    {
      id: 5120,
      name: '人权·法律·宗教',
    },
  ],
  mediaPlaybackRate: 1,
}

export default buildReducer(INITIAL_STATE, actors)
