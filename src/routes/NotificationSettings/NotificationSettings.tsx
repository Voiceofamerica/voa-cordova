
import * as React from 'react'
import { RouteComponentProps } from 'react-router'
import { connect, Dispatch } from 'react-redux'

import BottomNav, { IconItem } from '@voiceofamerica/voa-shared/components/BottomNav'
import Switch from '@voiceofamerica/voa-shared/components/Switch'

import AppState from 'types/AppState'

import { notificationSettingsLabels } from 'labels'
import toggleDaily from 'redux-store/thunks/toggleDaily'

import { notificationSettings, buttons, settingsButton } from './NotificationSettings.scss'

interface StateProps {
  dailyNotificationOn: boolean
}

interface DispatchProps {
  toggleDailyNotification: () => void
}

type OwnProps = RouteComponentProps<void>

type Props = OwnProps & StateProps & DispatchProps

class MediaSettingsBase extends React.Component<Props> {
  render () {
    const { history, dailyNotificationOn, toggleDailyNotification } = this.props

    return (
      <div className={notificationSettings}>
        <div className={buttons}>
          <div className={settingsButton}>
            {notificationSettingsLabels.dailyToggle}
            <Switch value={dailyNotificationOn} onClick={toggleDailyNotification} />
          </div>
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

const mapStateToProps = (state: AppState): StateProps => ({
  dailyNotificationOn: state.settings.dailyNotificationOn,
})

const mapDispatchToProps = (dispatch: Dispatch<AppState>): DispatchProps => ({
  toggleDailyNotification: () => dispatch(toggleDaily({})),
})

export default connect(mapStateToProps, mapDispatchToProps)(MediaSettingsBase)
