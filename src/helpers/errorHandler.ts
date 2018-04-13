
import { Observable } from 'rxjs/Observable'
import { ReplaySubject } from 'rxjs/ReplaySubject'

const baseErrorObservable = new Observable<Error>(sub => {
  window.addEventListener('error', ev => {
    sub.next(ev.error)
  })
})

export const errorObservable = new ReplaySubject<Error>(10)
baseErrorObservable.subscribe(errorObservable)
