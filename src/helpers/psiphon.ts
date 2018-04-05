
import * as psiphon from 'psiphon-cordova-plugin/www/psiphon'

const psiphonConfig = require('../psiphon_config')

const configPromise = new Promise((resolve, reject) => {
  document.addEventListener('deviceready', () => {
    console.log('configuring psiphon')
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
        console.log('starting psiphon')
        psiphon.start(resolve, reject)
      })
      document.addEventListener('resume', () => {
        console.log('resuming psiphon')
        psiphon.start(resolve, reject)
      })
      document.addEventListener('pause', () => {
        console.log('pausing psiphon')
        psiphon.pause(resolve, reject)
      })
    })
  })
}

export function pause (): Promise<void> {
  return configPromise.then(() => {
    return new Promise<void>((resolve, reject) => {
      document.addEventListener('deviceready', () => {
        console.log('pausing psiphon')
        psiphon.pause(resolve, reject)
      })
    })
  })
}

export function port (): Promise<number> {
  return configPromise.then(() => {
    return new Promise<number>((resolve, reject) => {
      document.addEventListener('deviceready', () => {
        console.log('setting psiphon port')
        psiphon.port(([portNumber]) => resolve(portNumber), reject)
      })
    })
  })
}
