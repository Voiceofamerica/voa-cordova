
import * as React from 'react'
import { History } from 'history'

import { IconItem } from '@voiceofamerica/voa-shared/components/BottomNav'
import SvgIcon from '@voiceofamerica/voa-shared/components/SvgIcon/SvgIcon'

import MainBottomNav from 'containers/MainBottomNav'
import { bottomNavLabels } from 'labels'
import { home, editorsChoice, audio, settings } from '../../svg';

import { icon, iconText, iconActive } from './DefaultBottomNav.scss'

interface Props {
  history: History
}

const HOME_RGX = /^\/$/
const BREAKING_NEWS_RGX = /^\/breakingNews/
const LIVE_STREAM_RGX = /^\/liveStream/
const SETTINGS_RGX = /^\/settings/

function determineIconClass(isActive: boolean) {
  return isActive ? `${icon} ${iconActive}` : icon;
}

export default class DefaultBottomNav extends React.Component<Props> {
  renderLeft () {
    const { history } = this.props

    const path = history.location.pathname
    const homeActive = HOME_RGX.test(path)
    const breakingNewsActive = BREAKING_NEWS_RGX.test(path)

    const homeIconClass = determineIconClass(homeActive);
    const breakingNewsIconClass = determineIconClass(breakingNewsActive);

    return [
      <IconItem key={0} active={homeActive} onClick={() => history.replace('/')}>
        <SvgIcon src={home} className={homeIconClass} />
        <div className={iconText}>{bottomNavLabels.home}</div>
      </IconItem>,
      <IconItem key={1} active={breakingNewsActive} onClick={() => history.replace('/breakingNews')}>
        <SvgIcon src={editorsChoice} className={breakingNewsIconClass} />
        <div className={iconText}>{bottomNavLabels.editorsChoice}</div>
      </IconItem>,
    ]
  }

  renderRight () {
    const { history } = this.props

    const path = history.location.pathname
    const liveStreamActive = LIVE_STREAM_RGX.test(path)
    const settingsActive = SETTINGS_RGX.test(path)

    const liveStreamIconClass = determineIconClass(liveStreamActive);
    const settingsIconClass = determineIconClass(settingsActive);

    return [
      <IconItem key={0} active={liveStreamActive} onClick={() => history.replace('/liveStream')}>
        <SvgIcon src={audio} className={liveStreamIconClass} />
        <div className={iconText}>{bottomNavLabels.programs}</div>
      </IconItem>,
      <IconItem key={1} active={settingsActive} onClick={() => history.replace('/settings')}>
        <SvgIcon src={settings} className={settingsIconClass} />
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
