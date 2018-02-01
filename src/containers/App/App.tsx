
import * as React from 'react'
import { Provider } from 'react-redux'
import { ApolloProvider } from 'react-apollo'

import store from 'redux-store'
import PsiphonIndicator from 'containers/PsiphonIndicator'
import Router from 'containers/Router'
import MediaPlayer from 'containers/MediaPlayer'
import CircumventionDrawer from 'containers/CircumventionDrawer'
import Intro from 'containers/Intro'
import client from 'helpers/graphql-client'
import { scheduleDaily } from 'helpers/notifications'

import { app } from './App.scss'

export default class App extends React.Component {

  componentDidMount () {
    const appState = store.getState()
    if (appState.settings.dailyNotificationOn) {
      scheduleDaily().catch(err => console.error(err))
    }
  }

  render () {
    return (
      <ApolloProvider client={client}>
        <Provider store={store}>
          <div className={app}>
            <Intro />
            <PsiphonIndicator />
            <Router />
            <MediaPlayer />
            <CircumventionDrawer />
          </div>
        </Provider>
      </ApolloProvider>
    )
  }
}
