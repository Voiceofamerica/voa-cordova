
import * as React from 'react'
import { RouteComponentProps } from 'react-router'
import { connect, Dispatch } from 'react-redux'
import { compose } from 'redux'

import analytics, { AnalyticsProps } from 'helpers/analytics'
import clearAll from 'redux-store/actions/clearAll'
import { routerActions } from 'react-router-redux'

import setTextSize from 'redux-store/actions/setTextSize'
import AppState from 'types/AppState'

import {
  settingsLabels,
  categorySettingsLabels,
  favoritesSettingsLabels,
  textSettingsLabels,
} from 'labels'

import { settings, panicButtonHolder, panicButton, panicButtonIcon, buttons, settingsRow, disabled, settingsButton, row, aboutVoa, content, settingsItem, settingsRowHeader, settingsValuesRow, active } from './Settings.scss'

const data = {
  textSize: [
    {
      description: textSettingsLabels.normalSize,
      value: 1,
    },
    {
      description: textSettingsLabels.largeSize,
      value: 1.5,
    },
    {
      description: textSettingsLabels.hugeSize,
      value: 2,
    },
  ],
}

interface StateProps {
  textSize: number
}

interface DispatchProps {
  clearAll: () => void
  setTextSize: (size: number) => void
}

type RouteProps = RouteComponentProps<void>

type Props = RouteProps & AnalyticsProps & StateProps & DispatchProps

class SettingsRoute extends React.Component<Props> {
  renderPanicButton () {
    const { clearAll } = this.props

    return (
      <div className={row}>
        <div className={panicButtonHolder}>
          <div className={panicButton} onClick={clearAll}>
            <i className={`mdi mdi-alert ${panicButtonIcon}`} />
            {settingsLabels.panic}
          </div>
        </div>
      </div>
    )
  }

  renderFavoritesSettings () {
    const { history } = this.props

    return (
      <div className={settingsRow}>
        <button className={settingsButton} onClick={() => history.push(`/settings/favorites`)}>
          {favoritesSettingsLabels.header}
        </button>
      </div>
    )
  }

  renderCategoriesSettings () {
    const { history } = this.props

    return (
      <div className={settingsRow}>
        <button className={settingsButton} onClick={() => history.push(`/settings/categories`)}>
          {categorySettingsLabels.header}
        </button>
      </div>
    )
  }

  renderTextSettings () {
    const { textSize, setTextSize } = this.props

    return (
      <div className={settingsRow}>
        <div className={settingsRowHeader}>
          {textSettingsLabels.header}
        </div>
        <div className={settingsValuesRow}>
          {
            data.textSize.map(size => (
              <div
                key={size.value}
                className={`${settingsItem} ${size.value === textSize ? active : ''}`}
                onClick={() => setTextSize(size.value)}
              >{size.description}</div>
            ))
          }
        </div>
      </div>
    )
  }

  renderSendToFriends () {
    return (
      <div className={settingsRow}>
        <button className={`${settingsButton} ${disabled}`}>
          {settingsLabels.sendToFriends}
        </button>
      </div>
    )
  }

  renderSendFeedback () {
    return (
      <div className={settingsRow}>
        <button className={`${settingsButton} ${disabled}`}>
          {settingsLabels.sendFeedback}
        </button>
      </div>
    )
  }

  renderAboutVoa () {
    return (
      <div className={settingsRow}>
        <span className={aboutVoa}>
          {settingsLabels.aboutVoa}
        </span>
      </div>
    )
  }

  render () {
    return (
      <div className={settings}>
        <div className={content}>
          { this.renderPanicButton() }
          <div className={buttons}>
            { this.renderFavoritesSettings() }
            { this.renderCategoriesSettings() }
            { this.renderTextSettings() }
            { this.renderSendToFriends() }
            { this.renderSendFeedback() }
            { this.renderAboutVoa() }
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state: AppState): StateProps => ({
  textSize: state.settings.textSize,
})

const mapDispatchToProps = (dispatch: Dispatch<any>): DispatchProps => ({
  clearAll: () => {
    dispatch(clearAll())
    dispatch(routerActions.replace('/'))
  },
  setTextSize: (textSize: number) =>
    dispatch(setTextSize({ textSize })),
})

const withRedux = connect(mapStateToProps, mapDispatchToProps)

const withAnalytics = analytics<Props>({
  state: 'Settings',
  title: 'Settings',
})

export default compose(
  withRedux,
  withAnalytics,
)(SettingsRoute)
