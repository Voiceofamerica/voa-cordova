
import * as React from 'react'

let ADB: AdbInterface

if (typeof cordova !== 'undefined') {
  ADB = require('adobe-mobile-services/sdks/Cordova/ADBMobile/Shared/ADB_Helper')
}

const PROXY_ON: 'on' = 'on'

interface TrackStateOptions {
  language: string
  section: string
  content_type: string
  page_title: string
  article_uid?: string
  audio_name?: string
  video_name?: string
  proxy_status: 'on' | 'off'
}

interface TrackActionOptions {
  language: string
  content_type: string
  page_title: string
  section?: string
  category?: string
  headline?: string
  article_uid?: string
  proxy_status: 'on' | 'off'
}

export interface AdbInterface {
  trackState<T> (path: string, options: TrackStateOptions & T)
  trackAction<T> (type: string, options: TrackActionOptions & T)
}

export function favoriteArticle (opts: { id: string, articleTitle: string, authors: string }) {
  ADB && ADB.trackAction('ARTICLE_TO_FAV', {
    language: 'zh-cn',
    content_type: 'article',
    article_uid: opts.id,
    page_title: opts.articleTitle,
    headline: opts.articleTitle,
    byline: opts.authors,
    proxy_status: PROXY_ON,
  })
}

export function shareArticle (opts: { id: string, articleTitle: string, authors: string }) {
  ADB && ADB.trackAction('ARTICLE_SHARED', {
    language: 'zh-cn',
    content_type: 'article',
    article_uid: opts.id,
    page_title: opts.articleTitle,
    headline: opts.articleTitle,
    byline: opts.authors,
    proxy_status: PROXY_ON,
  })
}

export const analyticsHelper = {
  favoriteArticle,
  shareArticle,
}

export interface AnalyticsProps {
  analytics: typeof analyticsHelper
}

export interface HOCAnalyticsOptions {
  state: string
  title: string
  section?: string
  type?: string
  skip?: boolean
}

function getVal<P> (item: HOCAnalyticsOptions | ((props: Readonly<P>, prevProps: Readonly<P>) => HOCAnalyticsOptions), props: P, prevProps: P): HOCAnalyticsOptions {
  if (typeof item === 'object') {
    return item
  } else if (typeof item === 'function') {
    return item(props, prevProps)
  } else {
    throw new Error(`Unexpected value type ${typeof item}`)
  }
}

export default function analytics<P = {}> (options: HOCAnalyticsOptions | ((props: P, newProps: P) => HOCAnalyticsOptions)) {
  return function (Component: React.ComponentType<P & AnalyticsProps>): React.ComponentType<P> {
    return class AnalyticsComponent extends React.Component<P> {
      componentDidMount () {
        const {
          state,
          title,
          section = 'listing',
          type = 'index',
          skip = false,
        } = getVal(options, this.props, {})

        if (skip) {
          return
        }

        ADB && ADB.trackState(state, {
          language: 'zh-cn',
          section: section,
          content_type: type,
          page_title: title,
          proxy_status: PROXY_ON,
        } as TrackStateOptions)
      }

      componentWillReceiveProps (nextProps: P) {
        const {
          state,
          title,
          section = 'listing',
          type = 'index',
          skip = false,
        } = getVal(options, nextProps, this.props)

        if (skip) {
          return
        }

        ADB && ADB.trackState(state, {
          language: 'zh-cn',
          section: section,
          content_type: type,
          page_title: title,
          proxy_status: PROXY_ON,
        } as TrackStateOptions)
      }

      render () {
        return (
          <Component { ...this.props } analytics={analyticsHelper}>
            {this.props.children}
          </Component>
        )
      }
    }
  }
}
