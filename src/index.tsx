
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'

import { momentLocale } from 'labels'

import * as moment from 'moment'

import './globalStyle.scss'

import App from './containers/App'

const rootElement = document.getElementById('app')

moment.locale(momentLocale)

let render = (Component, cb?) => {
  ReactDOM.render(
    <Component />,
    rootElement,
    cb,
  )
}
if (module.hot) {
  render = Component => {
    ReactDOM.render(
      <AppContainer>
        <Component />
      </AppContainer>,
      rootElement,
    )
  }

  module.hot.accept('./containers/App', () => {
    const NextApp = require('./containers/App').default
    render(NextApp)
  })
}

render(App)
