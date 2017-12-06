
import * as psiphon from 'psiphon-cordova-plugin/www/psiphon'

const psiphonConfig = require('../psiphon_config')

const configPromise = new Promise((resolve, reject) => {
  document.addEventListener('deviceready', () => {
    psiphon.config(psiphonConfig, resolve, reject)
  })
})

export function start (): Promise<void> {
  if (__HOST__) {
    return Promise.resolve()
  }
  return configPromise.then(() => {
    return new Promise<void>((resolve, reject) => {
      document.addEventListener('deviceready', () => {
        psiphon.start(resolve, reject)
      })
    })
  })
}

export function pause (): Promise<void> {
  return configPromise.then(() => {
    return new Promise<void>((resolve, reject) => {
      document.addEventListener('deviceready', () => {
        psiphon.pause(resolve, reject)
      })
    })
  })
}
