
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'

import * as moment from 'moment'

import './globalStyle.scss'

import App from './containers/App'
import { start } from 'helpers/psiphon'

const rootElement = document.getElementById('app')

moment.locale('zh-cn')

start().then(() => {
  const afsm = (window as any).AndroidFullScreen
  afsm && afsm.immersiveMode()

  let render = Component => {
    ReactDOM.render(
      <Component />,
      rootElement,
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
})

document.addEventListener(
  'backbutton',
  (ev) => { ev.preventDefault() },
  false,
)
