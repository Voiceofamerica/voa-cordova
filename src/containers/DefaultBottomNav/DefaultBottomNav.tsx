
import * as React from 'react'
import { History } from 'history'

import { IconItem } from '@voiceofamerica/voa-shared/components/BottomNav'

import MainBottomNav from 'containers/MainBottomNav'
import { bottomNavLabels } from 'labels'

import { iconText } from './DefaultBottomNav.scss'

interface Props {
  history: History
}

const HOME_RGX = /^\/$/
const BREAKING_NEWS_RGX = /^\/breakingNews/
const LIVE_STREAM_RGX = /^\/liveStream/
const SETTINGS_RGX = /^\/settings/

export default class DefaultBottomNav extends React.Component<Props> {
  renderLeft () {
    const { history } = this.props

    const path = history.location.pathname
    const homeActive = HOME_RGX.test(path)
    const breakingNewsActive = BREAKING_NEWS_RGX.test(path)

    return [
      <IconItem key={0} active={homeActive} onClick={() => history.replace('/')}>
        <i className='mdi mdi-home-outline' />
        <div className={iconText}>{bottomNavLabels.home}</div>
      </IconItem>,
      <IconItem key={1} active={breakingNewsActive} onClick={() => history.replace('/breakingNews')}>
        <i className='mdi mdi-flash-outline' />
        <div className={iconText}>{bottomNavLabels.breakingNews}</div>
      </IconItem>,
    ]
  }

  renderRight () {
    const { history } = this.props

    const path = history.location.pathname
    const liveStreamActive = LIVE_STREAM_RGX.test(path)
    const settingsActive = SETTINGS_RGX.test(path)

    return [
      <IconItem key={0} active={liveStreamActive} onClick={() => history.replace('/liveStream')}>
        <i className='mdi mdi-radio-tower' />
        <div className={iconText}>{bottomNavLabels.liveStream}</div>
      </IconItem>,
      <IconItem key={1} active={settingsActive} onClick={() => history.replace('/settings')}>
        <i className='mdi mdi-account-outline' />
        <div className={iconText}>{bottomNavLabels.settings}</div>
      </IconItem>,
    ]
  }

  render () {
    return (
      <MainBottomNav
        left={this.renderLeft()}
        right={this.renderRight()}
      />
    )
  }
}
