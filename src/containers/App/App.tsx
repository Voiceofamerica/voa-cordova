
import * as React from 'react'
import { Provider } from 'react-redux'
import { ApolloProvider } from 'react-apollo'

import Backdrop from '@voiceofamerica/voa-shared/components/Backdrop'
import OfflineIndicator from '@voiceofamerica/voa-shared/components/OfflineIndicator'
import { ready } from '@voiceofamerica/voa-shared/helpers/startup'

import store from 'redux-store'
import Router from 'containers/Router'
import client from 'helpers/graphql-client'

import { app, topNav } from './App.scss'

export default class App extends React.Component<void, { appReady: boolean }> {
  state = {
    appReady: false,
  }

  componentDidMount () {
    ready().then(() => this.setState({ appReady: true }))
  }

  render () {
    const { appReady } = this.state

    return (
      <ApolloProvider client={client}>
        <Provider store={store}>
          <div className={app}>
            <Backdrop imgSrc={require('res/images/Default.jpg')} blur={appReady} />
            <Router />
            <OfflineIndicator />
          </div>
        </Provider>
      </ApolloProvider>
    )
  }
}
