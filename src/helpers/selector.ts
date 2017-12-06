
import * as Selector from 'cordova-wheel-selector-plugin/www/selectorplugin'

export interface SelectorItem<T> {
  id?: string
  description: string
  value?: T
}

export interface SelectorConfig<T> {
  title: string
  items: SelectorItem<T>[][]
  defaultItems?: any,
  wrapWheelText?: boolean
  positiveButtonText?: string
  negativeButtonText?: string
  theme?: 'light' | 'dark'
}

export default {
  show<T> (config: SelectorConfig<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      Selector.showSelector(config, resolve, reject)
    })
  },
}
