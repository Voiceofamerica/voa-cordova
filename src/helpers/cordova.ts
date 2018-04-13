
import { errorObservable } from './errorHandler'
import { Observable } from 'rxjs/Observable'
import { Subject } from 'rxjs/Subject'

export const deviceIsReady = new Promise<Event>(resolve => {
  document.addEventListener('deviceready', (ev) => {
    console.log('device is now ready')
    errorObservable.subscribe(err => {
      console.error('FATAL: An uncaught error occurred!', err.message)
      console.error(err.stack)
    })
    console.log('error handler registered')
    resolve(ev)
  }, false)
})

export const appClosing = new Promise<Event>(resolve => {
  window.addEventListener('unload', (ev) => resolve(ev))
})

const baseAppResumeObservable = new Observable<Event>(sub => {
  const listener = (ev: Event) => sub.next(ev)
  document.addEventListener('resume', listener)
  return () => {
    document.removeEventListener('resume', listener)
  }
})

export const appResumeObservable = new Subject<Event>()
baseAppResumeObservable.subscribe(appResumeObservable)

const baseAppPauseObservable = new Observable<Event>(sub => {
  const listener = (ev: Event) => sub.next(ev)
  document.addEventListener('pause', listener)
  return () => {
    document.removeEventListener('pause', listener)
  }
})

export const appPauseObservable = new Subject<Event>()
baseAppPauseObservable.subscribe(appPauseObservable)

const baseBackButtonObservable = new Observable<Event>(sub => {
  const listener = (ev: Event) => sub.next(ev)
  document.addEventListener('backbutton', listener)
  return () => {
    document.removeEventListener('backbutton', listener)
  }
})

export const backButtonObservable = new Subject<Event>()
baseBackButtonObservable.subscribe(backButtonObservable)
