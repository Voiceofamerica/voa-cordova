
import * as React from 'react'
import { RouteComponentProps } from 'react-router'

import BottomNav, { IconItem } from '@voiceofamerica/voa-shared/components/BottomNav'
import { settings, topNav, buttons, settingsButton, buttonIcon } from './Settings.scss'

export default class HomeRoute extends React.Component<RouteComponentProps<void>> {
  render () {
    const { history } = this.props

    return (
      <div className={settings}>
        <div className={topNav}>我的设置</div>
        <div className={buttons}>
          <button className={settingsButton} onClick={() => history.push(`/settings/categories`)}>
            排列分类
            <i className={`mdi mdi-chevron-right ${buttonIcon}`} />
          </button>
          <button className={settingsButton} onClick={() => history.push(`/settings/media`)}>
            媒体设置
            <i className={`mdi mdi-chevron-right ${buttonIcon}`} />
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
