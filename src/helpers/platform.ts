
import { deviceIsReady } from './cordova'

export function isAndroid (): boolean {
  if (typeof device === 'undefined') {
    return false
  }

  return device.platform.toLowerCase() === 'android'
}
export function isIos (): boolean {
  if (typeof device === 'undefined') {
    return false
  }

  return device.platform.toLowerCase() === 'ios'
}

export function isWeb (): boolean {
  return typeof device === 'undefined'
}

deviceIsReady.then(() => {
  if (isIos()) {
    document.body.classList.add('ios')
  } else if (isAndroid()) {
    document.body.classList.add('android')
  } else if (isWeb()) {
    document.body.classList.add('web')
  }
})
