
import * as React from 'react'
import * as moment from 'moment'
import { connect, Dispatch } from 'react-redux'

import Switch from '@voiceofamerica/voa-shared/components/Switch'

import toggleNotifier from 'redux-store/thunks/toggleNotifier'
import AppState from 'types/AppState'

interface OwnProps {
  notificationId: number | string
  title: string
  time: moment.Moment
}

interface StateProps {
  notificationOn: boolean
}

interface DispatchProps {
  toggleNotification: () => void
}

type Props = OwnProps & DispatchProps & StateProps

class NotificationSwitchBase extends React.Component<Props> {
  render () {
    const { notificationOn, toggleNotification } = this.props
    return (<Switch value={notificationOn} onClick={toggleNotification} style={{ display: 'inline-block' }} />)
  }
}

const mapStateToProps = (state: AppState, ownProps: OwnProps): StateProps => ({
  notificationOn: state.notifications[ownProps.notificationId],
})

const mapDispatchToProps = (dispatch: Dispatch<AppState>, { notificationId: id, title, time }: OwnProps): DispatchProps => ({
  toggleNotification: () => dispatch(toggleNotifier({ id: id.toString(), title, time })),
})

const withRedux = connect(
  mapStateToProps,
  mapDispatchToProps,
)

export default withRedux(NotificationSwitchBase)
