import * as React from 'react'
import { Provider } from 'react-redux'
import { ApolloProvider } from 'react-apollo'

import store, { renderReady } from 'redux-store'
import PsiphonIndicator from 'containers/PsiphonIndicator'
import Router from 'containers/Router'
import MediaPlayer from 'containers/MediaPlayer'
import CircumventionDrawer from 'containers/CircumventionDrawer'
import Intro from 'containers/Intro'
import client from 'helpers/graphql-client'
import { showControls } from '@voiceofamerica/voa-shared/helpers/mediaControlHelper'
import { setPsiphonConfig, start } from '@voiceofamerica/voa-shared/helpers/psiphonHelper'
import { deviceIsReady } from '@voiceofamerica/voa-shared/helpers/cordovaHelper'

import { app } from './App.scss'

import {
  initializeNotifications,
  NotificationStatus,
  notificationSubject,
} from 'helpers/pushNotifications'
import toggleDailyNotification from 'redux-store/actions/toggleDailyNotification'
import { defaultAppTopic } from '../../labels'

import { ToastContainer, toast, Slide } from 'react-toastify'

interface State {
  appReady: boolean
}

interface IToast {
  notification: PhonegapPluginPush.NotificationEventResponse
  closeToast?
}

const ToastMessage = (props: IToast) => (
  <div>
    <div className="toast-title">{props.notification.title}</div>
    <div className="toast-message">{props.notification.message}</div>
    <button className="toast-dismiss" onClick={props.closeToast}>
      Dismiss
    </button>
  </div>
)

export default class App extends React.Component<{}, State> {
  helloButtonLabel = 'Hello 😀'
  dummyData: PhonegapPluginPush.NotificationEventResponse = {
    title: 'Article Title',
    message: 'Article Message',
    count: '1',
    image: null,
    sound: null,
    additionalData: null,
  }

  state: State = {
    appReady: false,
  }

  toastId: number = null

  dismissToast = () => toast.dismiss(this.toastId)

  handleToastNotification(data: PhonegapPluginPush.NotificationEventResponse) {
    this.toastId = toast(<ToastMessage notification={data} />, {
      bodyClassName: 'toast-text',
    })
  }

  componentDidMount() {
    renderReady
      .then(() => {
        const appState = store.getState()

        initializeNotifications(defaultAppTopic).subscribe(status => {
          if (status !== NotificationStatus.initialized) {
            const isOn = status === NotificationStatus.subscribed
            store.dispatch(toggleDailyNotification({ on: isOn }))
            notificationSubject.subscribe(this.handleToastNotification)
          }
        })

        console.log('psiphon enabled?', appState.settings.psiphonEnabled)
        if (appState.settings.psiphonEnabled) {
          setPsiphonConfig(require('../../psiphon_config.json'))
          start()
            .then(this.ready)
            .catch(err => {
              console.error('FATAL: psiphon failed to start correctly', err)
            })
        } else if (!__HOST__) {
          deviceIsReady.then(this.ready).catch(err => {
            console.error('FATAL: something went wrong during initialization', err)
          })
        } else {
          this.ready()
        }

        if (appState.media.mediaTitle) {
          showControls({
            title: appState.media.mediaTitle,
            playing: false,
          }).catch(() => {
            console.warn('media controls failed to load')
          })
        }
      })
      .catch(err => {
        console.error('FATAL: redux store failed to hyrate correctly', err)
      })
  }

  render() {
    const { appReady } = this.state
    return (
      <ApolloProvider client={client}>
        <Provider store={store}>
          {appReady ? (
            <div key="app" className={app}>
              <ToastContainer
                transition={Slide}
                autoClose={false}
                position={'top-center'}
                closeButton={false}
              />
              <Intro />
              <PsiphonIndicator />
              <Router />
              <MediaPlayer />
              <CircumventionDrawer />
              <button onClick={() => this.handleToastNotification(this.dummyData)}>
                {this.helloButtonLabel}
              </button>
            </div>
          ) : (
            <div key="app" />
          )}
        </Provider>
      </ApolloProvider>
    )
  }

  private ready = () => {
    this.setState({ appReady: true }, () => {
      const splash = (navigator as any).splashscreen
      if (splash) {
        splash.hide()
      }
      if (typeof StatusBar !== 'undefined') {
        StatusBar.overlaysWebView(false)
        StatusBar.backgroundColorByHexString('#eeeeee')
        StatusBar.styleDefault()
      }
    })
  }
}
