
import * as React from 'react'
import { RouteComponentProps } from 'react-router'

import BottomNav, { IconItem } from '@voiceofamerica/voa-shared/components/BottomNav'

import DefaultBottomNav from 'containers/DefaultBottomNav'

import { settings, topNav, buttons, settingsButton, buttonIcon } from './Settings.scss'

export default class HomeRoute extends React.Component<RouteComponentProps<void>> {
  render () {
    const { history } = this.props

    return (
      <div className={settings}>
        <div className={topNav}>我的设置</div>
        <div className={buttons}>
          <button className={settingsButton} onClick={() => history.push(`/settings/categories`)}>
            新闻分类排序
            <i className={`mdi mdi-chevron-right ${buttonIcon}`} />
          </button>
          <button className={settingsButton} onClick={() => history.push(`/settings/media`)}>
            视频设置
            <i className={`mdi mdi-chevron-right ${buttonIcon}`} />
          </button>
        </div>
        <DefaultBottomNav history={history} />
      </div>
    )
  }
}
