
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
