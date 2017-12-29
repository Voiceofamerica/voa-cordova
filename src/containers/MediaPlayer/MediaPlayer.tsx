
import * as React from 'react'
import { connect, Dispatch } from 'react-redux'

import MediaPlayer from '@voiceofamerica/voa-shared/components/MediaPlayer'
import ResilientImage from '@voiceofamerica/voa-shared/components/ResilientImage'

import AppState from 'types/AppState'
import MediaState from 'types/MediaState'
import toggleMediaDrawer from 'redux-store/actions/toggleMediaDrawer'
import toggleMediaPlaying from 'redux-store/actions/toggleMediaPlaying'
import {
  mediaPlayer,
  playerWrapper,
  player,
  backgroundImage,
  textContent,
  content,
  defaultText,
  hilight,
  open,
  closePlayer,
  overlay,
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
            <p>
              这是美国之音的<span className={hilight}>多媒体</span>播放器。 当您选择一个伴随音频或视频的故事时，它在这里播放。
            </p>
            <p>
              您可以随时查看原始故事或查找新故事，而无需通过在此页面上向下滑动来停止音频或视频。
            </p>
            <p>
              通过从屏幕底部的圆形蓝色<span className={hilight}>多媒体</span>按钮向上滑动来再次打开此屏幕。
            </p>
            <p>
              通过点击<span className={hilight}>多媒体</span>按钮启动和停止音频或视频。
            </p>
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
    const { media: { imageUrl, isVideo }, mediaPlaybackRate } = this.props

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
    const { media: { mediaTitle, mediaDescription, mediaOpen }, closeMedia } = this.props
    const className = mediaOpen ? `${mediaPlayer} ${open}` : mediaPlayer

    return (
      <div>
        <div className={mediaOpen ? `${overlay} ${open}` : overlay} />
        <div className={className}>
          <div className={content}>
            <div className={closePlayer} onClick={() => closeMedia()}>
              <i className='mdi mdi-chevron-down' />
            </div>
            {this.renderContent()}
          </div>
        </div>
      </div>
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
