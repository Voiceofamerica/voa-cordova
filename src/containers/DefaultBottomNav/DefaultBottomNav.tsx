
import * as React from 'react'
import { History } from 'history'

import { IconItem } from '@voiceofamerica/voa-shared/components/BottomNav'
import SvgIcon from '@voiceofamerica/voa-shared/components/SvgIcon'

import MainBottomNav from 'containers/MainBottomNav'

import { icon, iconActive } from './DefaultBottomNav.scss'

interface Props {
  history: History
}

const HOME_RGX = /^\/$/
const EDITORS_CHOICE_RGX = /^\/editorsChoice/
const PROGRAMS_RGX = /^\/programs/
const SETTINGS_RGX = /^\/settings/

function determineIconClass (isActive: boolean) {
  return isActive ? `${icon} ${iconActive}` : icon
}

export default class DefaultBottomNav extends React.Component<Props> {
  renderLeft () {
    const { history } = this.props

    const path = history.location.pathname
    const homeActive = HOME_RGX.test(path)
    const editorsChoiceActive = EDITORS_CHOICE_RGX.test(path)

    const homeIconClass = determineIconClass(homeActive)
    const editorsChoiceIconClass = determineIconClass(editorsChoiceActive)

    return [
      <IconItem key={0} active={homeActive} onClick={() => history.replace('/')}>
        <SvgIcon src={require('svg/home.svg')} className={homeIconClass} />
      </IconItem>,
      <IconItem key={1} active={editorsChoiceActive} onClick={() => history.replace('/editorsChoice')}>
        <SvgIcon src={require('svg/editors_choice.svg')} className={editorsChoiceIconClass} />
      </IconItem>,
    ]
  }

  renderRight () {
    const { history } = this.props

    const path = history.location.pathname
    const programsActive = PROGRAMS_RGX.test(path)
    const settingsActive = SETTINGS_RGX.test(path)

    const programsIconClass = determineIconClass(programsActive)
    const settingsIconClass = determineIconClass(settingsActive)

    return [
      <IconItem key={0} active={programsActive} onClick={() => history.replace('/programs')}>
        <SvgIcon src={require('svg/programs.svg')} className={programsIconClass} />
      </IconItem>,
      <IconItem key={1} active={settingsActive} onClick={() => history.replace('/settings')}>
        <SvgIcon src={require('svg/settings.svg')} className={settingsIconClass} />
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
