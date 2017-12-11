
import * as React from 'react'
import { RouteComponentProps } from 'react-router'

import BottomNav, { IconItem } from '@voiceofamerica/voa-shared/components/BottomNav'

import { mediaSettings, topNav, buttons, settingsButton, buttonIcon } from './MediaSettings.scss'

export default class HomeRoute extends React.Component<RouteComponentProps<void>> {
  changeMediaPlaybackRate = () => {
    return null
  }

  render () {
    const { history } = this.props

    return (
      <div className={mediaSettings}>
        <div className={topNav}>媒体设置</div>
        <div className={buttons}>
          <button className={settingsButton} onClick={this.changeMediaPlaybackRate}>
            回放速度
            <span className={buttonIcon}>1x</span>
          </button>
        </div>
        <BottomNav>
          <IconItem onClick={() => history.goBack()}>
            <i className={`mdi mdi-arrow-left`} />
          </IconItem>
        </BottomNav>
      </div>
    )
  }
}
