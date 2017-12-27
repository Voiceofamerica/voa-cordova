
import * as React from 'react'
import { RouteComponentProps } from 'react-router'
import { connect, Dispatch } from 'react-redux'

import BottomNav, { IconItem } from '@voiceofamerica/voa-shared/components/BottomNav'

import setMediaPlaybackRate from 'redux-store/actions/setMediaPlaybackRate'
import AppState from 'types/AppState'

import { mediaSettings, topNav, buttons, settingsButton, items, item, active } from './MediaSettings.scss'

const data = {
  speed: [
    {
      description: '常速',
      value: 1,
    },
    {
      description: '1.25倍速',
      value: 1.25,
    },
    {
      description: '1.5倍速',
      value: 1.5,
    },
    {
      description: '2倍速',
      value: 2,
    },
  ],
}

interface StateProps {
  mediaPlaybackRate: number
}

interface DispatchProps {
  setPlaybackRate: (speed: number) => void
}

type OwnProps = RouteComponentProps<void>

type Props = OwnProps & StateProps & DispatchProps

class MediaSettingsBase extends React.Component<Props> {
  render () {
    const { history, mediaPlaybackRate, setPlaybackRate } = this.props
    const chosen = data.speed.find(item => item.value === mediaPlaybackRate)

    return (
      <div className={mediaSettings}>
        <div className={topNav}>视频设置</div>
        <div className={buttons}>
          <div className={settingsButton}>
            播放速度
            <div className={items}>
              {
                data.speed.map(spd => (
                  <div
                    className={`${item} ${spd.value === mediaPlaybackRate ? active : ''}`}
                    onClick={() => setPlaybackRate(spd.value)}
                  >{spd.description}</div>
                ))
              }
            </div>
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
  mediaPlaybackRate: state.settings.mediaPlaybackRate,
})

const mapDispatchToProps = (dispatch: Dispatch<AppState>): DispatchProps => ({
  setPlaybackRate: (mediaPlaybackRate: number) =>
    dispatch(setMediaPlaybackRate({ mediaPlaybackRate })),
})

export default connect(mapStateToProps, mapDispatchToProps)(MediaSettingsBase)
