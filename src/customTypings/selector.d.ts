
interface SelectorItem<T> {
  description: string
  value: T
}

interface SelectorOptions<T> {
  title: string
  items: SelectorItem<T>[][]
  wrapWheelText?: boolean
  positiveButtonText?: string
  negativeButtonText?: string
  defaultItems?: string[]
  theme?: 'light' | 'dark'
}

declare const SelectorCordovaPlugin: {
  showSelector: <T>(
    options: SelectorOptions<T>,
    successCb: (res: SelectorItem<T>[]) => void,
    cancelCb?: () => void
  ) => void
}
