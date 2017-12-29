
import * as React from 'react'
import { RouteComponentProps } from 'react-router'
import { connect, Dispatch } from 'react-redux'
import { compose } from 'redux'

import BottomNav, { IconItem } from '@voiceofamerica/voa-shared/components/BottomNav'

import DefaultBottomNav from 'containers/DefaultBottomNav'
import analytics, { AnalyticsProps } from 'helpers/analytics'
import clearAll from 'redux-store/actions/clearAll'

import { settings, panicButtonHolder, panicButton, topNav, buttons, settingsButton, buttonIcon } from './Settings.scss'

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
            马上删除此程序
          </div>
        </div>
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
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch: Dispatch<any>): DispatchProps => ({
  clearAll: () => dispatch(clearAll()),
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
