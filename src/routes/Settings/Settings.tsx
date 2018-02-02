
import * as React from 'react'
import { RouteComponentProps } from 'react-router'
import { connect, Dispatch } from 'react-redux'
import { compose } from 'redux'

import analytics, { AnalyticsProps } from 'helpers/analytics'
import clearAll from 'redux-store/actions/clearAll'
import { routerActions } from 'react-router-redux'

import {
  settingsLabels,
  categorySettingsLabels,
  mediaSettingsLabels,
  favoritesSettingsLabels,
  notificationSettingsLabels,
  textSettingsLabels,
} from 'labels'

import { settings, panicButtonHolder, panicButton, buttons, settingsButton, buttonIcon } from './Settings.scss'

interface DispatchProps {
  clearAll: () => void
}

type RouteProps = RouteComponentProps<void>

type Props = RouteProps & AnalyticsProps & DispatchProps

class SettingsRoute extends React.Component<Props> {
  render () {
    const { history, clearAll } = this.props

    return (
      <div className={settings}>
        <div className={panicButtonHolder}>
          <div className={panicButton} onClick={clearAll}>
            {settingsLabels.panic}
          </div>
        </div>
        <div className={buttons}>
          <button className={settingsButton} onClick={() => history.push(`/settings/notifications`)}>
            {notificationSettingsLabels.header}
            <i className={`mdi mdi-chevron-right ${buttonIcon}`} />
          </button>
          <button className={settingsButton} onClick={() => history.push(`/settings/favorites`)}>
            {favoritesSettingsLabels.header}
            <i className={`mdi mdi-chevron-right ${buttonIcon}`} />
          </button>
          <button className={settingsButton} onClick={() => history.push(`/settings/categories`)}>
            {categorySettingsLabels.header}
            <i className={`mdi mdi-chevron-right ${buttonIcon}`} />
          </button>
          <button className={settingsButton} onClick={() => history.push(`/settings/text`)}>
            {textSettingsLabels.header}
            <i className={`mdi mdi-chevron-right ${buttonIcon}`} />
          </button>
          <button className={settingsButton} onClick={() => history.push(`/settings/media`)}>
            {mediaSettingsLabels.header}
            <i className={`mdi mdi-chevron-right ${buttonIcon}`} />
          </button>
        </div>
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch: Dispatch<any>): DispatchProps => ({
  clearAll: () => {
    dispatch(clearAll())
    dispatch(routerActions.replace('/'))
  },
})

const withRedux = connect(null, mapDispatchToProps)

const withAnalytics = analytics<Props>({
  state: 'Settings',
  title: 'Settings',
})

export default compose(
  withRedux,
  withAnalytics,
)(SettingsRoute)
