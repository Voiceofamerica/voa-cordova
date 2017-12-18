
import * as React from 'react'
import { connect, Dispatch } from 'react-redux'

import BottomNav, { IconItem, RoundItem } from '@voiceofamerica/voa-shared/components/BottomNav'
import ResilientImage from '@voiceofamerica/voa-shared/components/ResilientImage'

import toggleMediaDrawer from 'redux-store/actions/toggleMediaDrawer'
import AppState from 'types/AppState'

import { bottomNav, centerIcon, iconText, mediaIsOpen, centerButton, backgroundImage, overlay } from './MainBottomNav.scss'

interface OwnProps {
  left: JSX.Element[]
  right: JSX.Element[]
}

interface StateProps {
  mediaDrawerOpen: boolean
  mediaImageUrl: string
}

interface DispatchProps {
  toggleMediaPlayer: () => void
}

type Props = OwnProps & DispatchProps & StateProps

class MainBottomNavBase extends React.Component<Props> {
  hasImage () {
    const { mediaImageUrl } = this.props
    return !!mediaImageUrl
  }

  renderImage () {
    const { mediaImageUrl } = this.props

    if (!this.hasImage()) {
      return null
    }

    return (
     <div className={backgroundImage}>
       <ResilientImage src={mediaImageUrl} />
       <div className={overlay} />
      </div>
    )
  }

  render () {
    const { left, right, toggleMediaPlayer, mediaDrawerOpen } = this.props

    let className = mediaDrawerOpen ? `${bottomNav} ${mediaIsOpen}` : bottomNav

    return (
      <BottomNav className={className}>
        {left}
        <RoundItem onClick={() => toggleMediaPlayer()} className={centerButton}>
          { this.renderImage() }
          <i className={`mdi mdi-play-circle-outline ${centerIcon}`} />
          <div className={iconText}>多媒体</div>
        </RoundItem>
        {right}
      </BottomNav>
    )
  }
}

const mapStateToProps = (state: AppState, ownProps: OwnProps): StateProps => ({
  mediaDrawerOpen: state.media.mediaOpen,
  mediaImageUrl: state.media.imageUrl,
})

const mapDispatchToProps = (dispatch: Dispatch<AppState>, ownProps: OwnProps): DispatchProps => ({
  toggleMediaPlayer: () => dispatch(toggleMediaDrawer({})),
})

const withRedux = connect(
  mapStateToProps,
  mapDispatchToProps,
)

export default withRedux(MainBottomNavBase)
