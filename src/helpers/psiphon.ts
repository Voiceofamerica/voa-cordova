
import { Observable } from 'rxjs/Observable'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { Subscription } from 'rxjs/Subscription'
import 'rxjs/add/operator/mergeMap'
import 'rxjs/add/operator/filter'
import 'rxjs/add/operator/first'
import 'rxjs/add/operator/distinctUntilChanged'

import * as psiphon from 'psiphon-cordova-plugin/www/psiphon'

import { deviceIsReady, appResumeObservable } from './cordova'

const psiphonConfig = require('../psiphon_config')

const configPromise = deviceIsReady
  .then(() => new Promise((resolve, reject) => {
    console.log('configuring psiphon')
    psiphon.config(psiphonConfig, resolve, reject)
  }))

const baseStartObservable = new Observable<boolean>((sub) => {
  if (__HOST__) {
    sub.next(false)
    return () => null
  }

  const resumeSub = appResumeObservable.subscribe(() => {
    console.log('resuming psiphon')
    psiphon.start(() => sub.next(true), (err) => sub.error(err))
  })

  configPromise.then(() => {
    console.log('starting psiphon')
    psiphon.start(() => sub.next(true), (err) => sub.error(err))
  }).catch((err) => {
    console.error('something went wrong configuring psiphon', err)
  })

  return () => {
    resumeSub.unsubscribe()
  }
})

export const startObservable = new BehaviorSubject(false)
export const toggleObservable = startObservable.distinctUntilChanged()
let startSubscription: Subscription

export function start (): Promise<void> {
  if (__HOST__) {
    return Promise.resolve()
  }

  if (!startSubscription || startSubscription.closed) {
    startSubscription = baseStartObservable.subscribe(startObservable)
  }

  return new Promise((resolve, reject) => {
    startObservable
      .first(started => started)
      .subscribe(
        () => resolve(),
        (err) => reject(err),
      )
  })
}

export function pause (): Promise<void> {
  if (startSubscription) {
    startSubscription.unsubscribe()
    startSubscription = undefined
    startObservable.next(false)
  }

  return configPromise.then(() => {
    return new Promise<void>((resolve, reject) => {
      console.log('pausing psiphon')
      psiphon.pause(resolve, reject)
    })
  })
}

export function port (): Promise<number> {
  return configPromise.then(() => {
    return new Promise<number>((resolve, reject) => {
      console.log('getting psiphon port')
      psiphon.port(([portNumber]) => resolve(portNumber), reject)
    })
  })
}
