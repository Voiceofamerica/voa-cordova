
import * as React from 'react'
import { Provider } from 'react-redux'
import { ApolloProvider } from 'react-apollo'

import Backdrop from '@voiceofamerica/voa-shared/components/Backdrop'
import OfflineIndicator from '@voiceofamerica/voa-shared/components/OfflineIndicator'
import { ready } from '@voiceofamerica/voa-shared/helpers/startup'

import store from 'redux-store'
import PsiphonIndicator from 'components/PsiphonIndicator'
import Router from 'containers/Router'
import MediaPlayer from 'containers/MediaPlayer'
import client from 'helpers/graphql-client'

import { app } from './App.scss'

export default class App extends React.Component<void, { appReady: boolean }> {
  state = {
    appReady: false,
  }

  componentDidMount () {
    ready()
      .then(() => this.setState({ appReady: true }))
      .catch((err) => {
        console.error(err)
      })
  }

  render () {
    const { appReady } = this.state

    return (
      <ApolloProvider client={client}>
        <Provider store={store}>
          <div className={app}>
            <PsiphonIndicator />
            <Backdrop imgSrc={require('res/images/Default.png')} blur={appReady} />
            <Router />
            <MediaPlayer />
          </div>
        </Provider>
      </ApolloProvider>
    )
  }
}
