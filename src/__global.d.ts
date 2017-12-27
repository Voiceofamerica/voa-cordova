
declare const __DEV__: boolean
declare const __HOST__: boolean

interface PdfOptions {
  documentSize: 'A4' | 'A3' | 'A2'
  type: 'base64' | 'share'
  fileName?: string
}

declare const pdf: {
  fromURL: (url: string, options: PdfOptions) => Promise<string>
  fromData: (html: string, options: PdfOptions) => Promise<string>
}

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
