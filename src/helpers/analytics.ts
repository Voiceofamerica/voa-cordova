
import * as ADB_Original from 'adobe-mobile-services/sdks/Cordova/ADBMobile/Shared/ADB_Helper'

interface TrackStateOptions {
  language: string
  section: string
  content_type: string
  page_title: string
  proxy_status: 'on' | 'off'
}

export interface AdbInterface {
  trackState<T> (path: string, options: TrackStateOptions & T)
}

const ADB: AdbInterface = ADB_Original

export default {
  trackHome () {
    ADB.trackState('Home', {
      language: 'zh-cn',
      section: 'home',
      content_type: 'index',
      page_title: 'home',
      proxy_status: 'on',
    } as TrackStateOptions)
  },
}
