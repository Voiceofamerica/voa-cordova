
import * as React from 'react'
import { connect, Dispatch } from 'react-redux'

import MediaPlayer from '@voiceofamerica/voa-shared/components/MediaPlayer'
import ResilientImage from '@voiceofamerica/voa-shared/components/ResilientImage'
import Drawer from '@voiceofamerica/voa-shared/components/Drawer'

import AppState from 'types/AppState'
import MediaState from 'types/MediaState'
import toggleMediaDrawer from 'redux-store/actions/toggleMediaDrawer'
import toggleMediaPlaying from 'redux-store/actions/toggleMediaPlaying'

import { mediaPlayerLabels } from 'labels'

import {
  mediaPlayer,
  playerWrapper,
  player,
  backgroundImage,
  textContent,
  defaultText,
} from './MediaPlayer.scss'

interface StateProps {
  media: MediaState
  mediaPlaybackRate: number
}

interface DispatchProps {
  closeMedia: () => void
  toggleMediaPlaying: (playing: boolean) => void
}

type Props = StateProps & DispatchProps

class MediaPlayerBase extends React.Component<Props> {
  private player: MediaPlayer

  componentWillReceiveProps (nextProps: Props) {
    if (this.props.media.playing !== nextProps.media.playing && this.player) {
      this.player.togglePlay(nextProps.media.playing)
    }
  }

  renderDefault () {
    return (
      <div>
        <ResilientImage src={require('../../../res/images/MediaDefault.png')} />
        <div className={textContent}>
          <div className={defaultText}>
            {mediaPlayerLabels.empty}
          </div>
        </div>
      </div>
    )
  }

  renderPlayer () {
    const { media: { mediaUrl, playing, mediaOpen }, mediaPlaybackRate, toggleMediaPlaying } = this.props
    if (!mediaUrl) {
      return null
    }

    return (
      <div className={playerWrapper}>
        {this.renderImage()}
        <MediaPlayer
          ref={this.setPlayer}
          className={player}
          src={mediaUrl}
          controls={mediaOpen}
          playbackRate={mediaPlaybackRate}
          autoPlay={playing}
          onTogglePlay={toggleMediaPlaying}
        />
      </div>
    )
  }

  renderImage () {
    const { media: { imageUrl, isVideo } } = this.props

    if (isVideo) {
      return null
    }

    return (
      <ResilientImage
        src={imageUrl}
        defaultSrc={require('res/images/imagedefault.gif')}
        className={backgroundImage}
      />
    )
  }

  renderContent () {
    const { media: { mediaUrl, mediaTitle, mediaDescription } } = this.props
    if (!mediaUrl) {
      return this.renderDefault()
    }

    return (
      <div>
        {this.renderPlayer()}
        <div className={textContent}>
          <h1>{mediaTitle}</h1>
          <div>{mediaDescription}</div>
        </div>
      </div>
    )
  }

  render () {
    const { media: { mediaOpen }, closeMedia } = this.props
    return (
      <Drawer className={mediaPlayer} open={mediaOpen} onClose={closeMedia}>
        {this.renderContent()}
      </Drawer>
    )
  }

  private setPlayer = (player: MediaPlayer) => {
    this.player = player
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
    toggleMediaPlaying: (playing) => dispatch(toggleMediaPlaying({ playing })),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MediaPlayerBase)
