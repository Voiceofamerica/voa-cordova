
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'

import * as moment from 'moment'

import { momentLocale } from 'labels'

import './globalStyle.scss'

import App from './containers/App'
import { start } from 'helpers/psiphon'

const rootElement = document.getElementById('app')

moment.locale(momentLocale)

start().then(() => {
  const afsm = (window as any).AndroidFullScreen
  afsm && afsm.immersiveMode()

  let render = (Component, cb?) => {
    ReactDOM.render(
      <Component />,
      rootElement,
      cb,
    )
  }
  if (module.hot) {
    render = (Component, cb?) => {
      ReactDOM.render(
        <AppContainer>
          <Component />
        </AppContainer>,
        rootElement,
        cb,
      )
    }

    module.hot.accept('./containers/App', () => {
      const NextApp = require('./containers/App').default
      render(NextApp)
    })
  }

  render(App, () => {
    setTimeout(() => {
      (navigator as any).splashscreen.hide()
    }, 3000)
  })
}).catch(err => {
  console.error(err)
})

document.addEventListener(
  'backbutton',
  (ev) => { ev.preventDefault() },
  false,
)
