
import {
  type as setCategoryOrderType,
  SetCategoryAction,
} from '../actions/setCategoryOrder'

import {
  type as setMediaPlaybackRateType,
  SetMediaPlaybackRateAction,
} from '../actions/setMediaPlaybackRate'

import {
  type as toggleDailyNotificationType,
  ToggleDailyNotificationAction,
} from '../actions/toggleDailyNotification'

import {
  type as setTextSizeType,
  SetTextSizeAction,
} from '../actions/setTextSize'

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
  [toggleDailyNotificationType]: (prev, { on: dailyNotificationOn = !prev.dailyNotificationOn }: ToggleDailyNotificationAction) => ({
    ...prev,
    dailyNotificationOn,
  }),
  [setTextSizeType]: (prev, { textSize }: SetTextSizeAction) => ({
    ...prev,
    textSize,
  }),
}

export const INITIAL_STATE: AppSettings = {
  categories: [
    {
      id: 1746,
      name: '美国',
    },
    {
      id: 1757,
      name: '中国',
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
      id: 1740,
      name: '国际',
    },
    {
      id: 1748,
      name: '经济·金融·贸易',
    },
    {
      id: 1756,
      name: '人权',
    },
    {
      id: 1772,
      name: '军事',
    },
    {
      id: 1737,
      name: '学英语',
    },
  ],
  mediaPlaybackRate: 1,
  dailyNotificationOn: true,
  textSize: 1,
}

export default buildReducer(INITIAL_STATE, actors)
