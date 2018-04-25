
declare module NotificationPlugin {
  export interface Action {
    id?: string
    title: string
    type: 'button'|'input'
    launch?: boolean
    ui?: any
    needsAuth?: boolean
    icon?: string
    emptyText?: string
    submitTitle?: string
    editable?: boolean
    choices?: string[]
    defaultValue?: string
  }

  type Every = 'minute' | 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year' | {
               minute?: number
               hour?: number
               day?: number
               month?: number
             }



  export interface DateTrigger {
    at: Date
  }

  export interface LocationTrigger {
    type: 'location'
    center: [number, number]
    radius: number
    notifyOnEntry?: boolean
    notifyOnExit?: boolean
    single?: boolean
  }

  export interface WaitTrigger {
    in: number
    unit: 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year'
  }

  export interface EveryTrigger {
    count?: number
    every: Every
    firstAt?: Date
    after?: Date
  }

  export type Trigger = DateTrigger | LocationTrigger | WaitTrigger | EveryTrigger

  export interface Message {
    person?: string
    message: string
  }

  export interface Notification {
    title: string
    text?: string | (Message[])
    id?: string
    foreground?: boolean
    sound?: string
    actions?: Action[]
    trigger?: Trigger
    smallIcon?: string
    icon?: string
  }
}

interface CordovaPlugins {
  notification: {
    local: {
      hasPermission (cb: Function, scope?: any)
      requestPermission (cb: Function, scope?: any)
      schedule (notifications: NotificationPlugin.Notification | (NotificationPlugin.Notification[]), cb: Function, scope?: any, args?: any)
      clear (ids: string[], cb: Function, scope?: any)
      clearAll (cb: Function, scope?: any)
      cancel (ids: string[], cb: Function, scope?: any)
      cancelAll (cb: Function, scope?: any)
      isPresent (id: string, cb: Function, scope?: any)
      isScheduled (id: string, cb: Function, scope?: any)
      isTriggered (id: string, cb: Function, scope?: any)
      getType (id: string, cb: Function, scope?: any)
      getIds (cb: Function, scope?: any)
      getScheduledIds (cb: Function, scope?: any)
    }
  }
}