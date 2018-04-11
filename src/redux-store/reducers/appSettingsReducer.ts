
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
      id: 1696,
      name: 'سرخط خبرها',
    },
    {
      id: 1041,
      name: 'ايران',
    },
    {
      id: 1050,
      name: 'آمريکا',
    },
    {
      id: 1058,
      name: 'جهان',
    },
    {
      id: 1080,
      name: 'فرهنگ و زندگی',
    },
    {
      id: 1066,
      name: 'اقتصادی',
    },
    {
      id: 1035,
      name: 'ورزش',
    },
    {
      id: 1037,
      name: 'علم و فن آوری',
    },
    {
      id: 1113,
      name: 'گالری عکس',
    },
  ],
  mediaPlaybackRate: 1,
  dailyNotificationOn: true,
  usePsiphon: true,
  textSize: 1,
}

export default buildReducer(INITIAL_STATE, actors)
