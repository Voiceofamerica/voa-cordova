
import * as React from 'react'
import { RouteComponentProps } from 'react-router'

import BottomNav, { IconItem, RoundItem } from '@voiceofamerica/voa-shared/components/BottomNav'
import selector, { SelectorItem } from 'helpers/selector'

import { mediaSettings, topNav, buttons, settingsButton, buttonIcon } from './MediaSettings.scss'

const playbackSpeedOptions: SelectorItem<number>[] = [
  {
    description: '0.5x',
    value: 0.5,
  },
  {
    description: '0.75x',
    value: 0.75,
  },
  {
    description: '1x',
    value: 1,
  },
  {
    description: '1.25x',
    value: 1.25,
  },
  {
    description: '1.5x',
    value: 1.5,
  },
  {
    description: '2x',
    value: 2,
  },
]

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
