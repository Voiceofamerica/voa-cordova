
import * as React from 'react'
import { connect } from 'react-redux'

import MediaPlayer from '@voiceofamerica/voa-shared/components/MediaPlayer'

import AppState from 'types/AppState'

interface OwnProps {
  src: string
  className?: string
  style?: React.CSSProperties
}

interface StateProps {
  playbackRate: number
}

const mapStateToProps = (state: AppState, ownProps: OwnProps): StateProps => {
  return {
    playbackRate: state.settings.mediaPlaybackRate,
  }
}

export default connect(mapStateToProps, MediaPlayer)
