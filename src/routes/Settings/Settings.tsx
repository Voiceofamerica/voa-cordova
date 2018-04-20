
import * as React from 'react'
import { RouteComponentProps } from 'react-router'
import { connect, Dispatch } from 'react-redux'
import { compose } from 'redux'

import analytics, { AnalyticsProps } from '@voiceofamerica/voa-shared/helpers/analyticsHelper'
import clearAll from 'redux-store/actions/clearAll'
import { routerActions } from 'react-router-redux'

import setMediaPlaybackRate from 'redux-store/actions/setMediaPlaybackRate'
import setTextSize from 'redux-store/actions/setTextSize'
import AppState from 'types/AppState'

import {
  settingsLabels,
  categorySettingsLabels,
  favoritesSettingsLabels,
  textSettingsLabels,
  mediaSettingsLabels,
} from 'labels'

import { settings, panicButtonHolder, panicButton, panicButtonIcon, buttons, settingsRow, settingsButton, row, aboutVoa, content, settingsItem, settingsRowHeader, settingsValuesRow, active } from './Settings.scss'

const SHARE_URL = 'https://www.voanews.com/p/5850.html'

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
  speed: [
    {
      description: mediaSettingsLabels.normalSpeed,
      value: 1,
    },
    {
      description: mediaSettingsLabels.halfAgainSpeed,
      value: 1.5,
    },
    {
      description: mediaSettingsLabels.doubleSpeed,
      value: 2,
    },
  ],
}

interface StateProps {
  textSize: number
  mediaPlaybackRate: number
}

interface DispatchProps {
  clearAll: () => void
  setTextSize: (size: number) => void
  setPlaybackRate: (speed: number) => void
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
          {textSettingsLabels.textSize}
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

  renderPlaybackSpeed () {
    const { mediaPlaybackRate, setPlaybackRate } = this.props

    return (
      <div className={settingsRow}>
        <div className={settingsRowHeader}>
          {mediaSettingsLabels.chooseSpeed}
        </div>
        <div className={settingsValuesRow}>
          {
            data.speed.map(speed => (
              <div
                key={speed.value}
                className={`${settingsItem} ${speed.value === mediaPlaybackRate ? active : ''}`}
                onClick={() => setPlaybackRate(speed.value)}
              >{speed.description}</div>
            ))
          }
        </div>
      </div>
    )
  }

  renderSendToFriends () {
    return (
      <div className={settingsRow}>
        <button className={settingsButton} onClick={this.shareApp}>
          {settingsLabels.sendToFriends}
        </button>
      </div>
    )
  }

  renderSendFeedback () {
    const url = `mailto:${settingsLabels.feedbackEmail}?subject=${settingsLabels.feedbackSubject}&body=${settingsLabels.feedbackBody}`

    return (
      <div className={settingsRow}>
        <a href={url} className={settingsButton}>
          {settingsLabels.sendFeedback}
        </a>
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
            { this.renderPlaybackSpeed() }
            { this.renderSendToFriends() }
            { this.renderSendFeedback() }
            { this.renderAboutVoa() }
          </div>
        </div>
      </div>
    )
  }

  private shareApp = () => {
    window.plugins.socialsharing.shareWithOptions({
      message: settingsLabels.shareMessage,
      url: SHARE_URL,
    })
  }
}

const mapStateToProps = (state: AppState): StateProps => ({
  textSize: state.settings.textSize,
  mediaPlaybackRate: state.settings.mediaPlaybackRate,
})

const mapDispatchToProps = (dispatch: Dispatch<any>): DispatchProps => ({
  clearAll: () => {
    dispatch(clearAll())
    dispatch(routerActions.replace('/'))
  },
  setTextSize: (textSize: number) =>
    dispatch(setTextSize({ textSize })),
  setPlaybackRate: (mediaPlaybackRate: number) =>
    dispatch(setMediaPlaybackRate({ mediaPlaybackRate })),
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
