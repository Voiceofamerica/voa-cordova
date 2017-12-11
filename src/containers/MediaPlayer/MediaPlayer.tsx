
import * as React from 'react'
import { connect, Dispatch } from 'react-redux'

import MediaPlayer from '@voiceofamerica/voa-shared/components/MediaPlayer'

import AppState from 'types/AppState'
import MediaState from 'types/MediaState'
import toggleMediaDrawer from 'redux-store/actions/toggleMediaDrawer'
import { mediaPlayer, player, textContent, open, closePlayer, overlay } from './MediaPlayer.scss'

interface StateProps {
  media: MediaState
  mediaPlaybackRate: number
}

interface DispatchProps {
  closeMedia: () => void
}

type Props = StateProps & DispatchProps

class MediaPlayerBase extends React.Component<Props> {
  renderPlayer () {
    const { media: { mediaUrl }, mediaPlaybackRate } = this.props
    if (!mediaUrl) {
      return null
    }

    return (
      <div className={player}>
        <MediaPlayer src={mediaUrl} playbackRate={mediaPlaybackRate} autoPlay />
      </div>
    )
  }

  render () {
    const { media: { mediaTitle, mediaDescription, mediaOpen }, closeMedia } = this.props
    const className = mediaOpen ? `${mediaPlayer} ${open}` : mediaPlayer

    return (
      <div>
        <div className={mediaOpen ? `${overlay} ${open}` : overlay} />
        <div className={className}>
          <div className={closePlayer} onClick={() => closeMedia()}><i className='mdi mdi-chevron-down' /></div>
          {this.renderPlayer()}
          <div className={textContent}>
            <h1>{mediaTitle}</h1>
            <div>{mediaDescription}</div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({ settings: { mediaPlaybackRate }, media }: AppState): StateProps => {
  return {
    media,
    mediaPlaybackRate,
  }
}

const mapDispatchToProps = (dispatch: Dispatch<AppState>): DispatchProps => {
  return {
    closeMedia: () => dispatch(toggleMediaDrawer({ open: false })),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MediaPlayerBase)
