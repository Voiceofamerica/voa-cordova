
import * as React from 'react'
import { Provider } from 'react-redux'
import { ApolloProvider } from 'react-apollo'

import store, { onRenderReady } from 'redux-store'
import PsiphonIndicator from 'containers/PsiphonIndicator'
import Router from 'containers/Router'
import MediaPlayer from 'containers/MediaPlayer'
import CircumventionDrawer from 'containers/CircumventionDrawer'
import Intro from 'containers/Intro'
import client from 'helpers/graphql-client'
import { showControls } from 'helpers/mediaControlHelper'
import { scheduleDaily } from 'helpers/localNotifications'
import { start } from 'helpers/psiphon'

import { app } from './App.scss'

interface State {
  appReady: boolean
}

export default class App extends React.Component<{}, State> {
  state: State = {
    appReady: false,
  }

  componentDidMount () {
    onRenderReady(() => {
      const appState = store.getState()
      if (appState.settings.dailyNotificationOn) {
        scheduleDaily().catch(err => console.error(err))
      }

      if (appState.settings.usePsiphon) {
        start().then(() => {
          this.ready()
        }).catch(console.error)
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
  }

  render () {
    const { appReady } = this.state
    return (
      <ApolloProvider client={client}>
        <Provider store={store}>
          {
            appReady
            ? <div key='app' className={app}>
                <Intro />
                <PsiphonIndicator />
                <Router />
                <MediaPlayer />
                <CircumventionDrawer />
              </div>
            : <div key='app' />
          }
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
    })
  }
}
