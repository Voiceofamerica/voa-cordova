
import * as React from 'react'
import { RouteComponentProps } from 'react-router'
import { connect, Dispatch } from 'react-redux'
import { compose } from 'redux'
import { graphql, ChildProps } from 'react-apollo'
import * as moment from 'moment'

import ResilientImage from '@voiceofamerica/voa-shared/components/ResilientImage'
import Ticket from '@voiceofamerica/voa-shared/components/Ticket'
import BottomNav, { IconItem, RoundItem } from '@voiceofamerica/voa-shared/components/BottomNav'
import TopNav, { TopNavItem } from '@voiceofamerica/voa-shared/components/TopNav'

import { LiveStreamQuery, ProgramType } from 'helpers/graphql-types'
import analytics from 'helpers/analytics'
import playMedia from 'redux-store/thunks/playMediaFromBlob'

import AppState from 'types/AppState'
import Category from 'types/Category'

import * as Query from './LiveStream.graphql'
import { liveStream, content, programTime, liveStreamItem, programTitle, collapser, collapserIconContainer, collapserIcon, drawer, drawerImage, imageIcon, drawerContent, open } from './LiveStream.scss'

interface DispatchProps {
  playMedia: (url: string, title: string, description: string, isVideo: boolean, imageUrl: string) => void
}

type Props = ChildProps<RouteComponentProps<void>, LiveStreamQuery> & DispatchProps

interface State {
  drawerStates: { [id: number]: boolean }
}

class LiveStreamBase extends React.Component<Props, State> {
  state: State = {
    drawerStates: {},
  }

  toggleDrawer = (id: number, open = !this.state.drawerStates[id]) => {
    this.setState(prev => ({
      ...prev,
      drawerStates: {
        ...prev.drawerStates,
        [id]: open,
      },
    }))
  }

  renderLoading () {
    const { data } = this.props
    if (!data.loading) {
      return null
    }

    return (
      <div style={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center', height: '100%', zIndex: 1 }}>
        <div style={{ alignContent: 'center', fontSize: '10vw', backgroundColor: 'transparent', textAlign: 'center' }}>
          装载...
        </div>
      </div>
    )
  }

  renderIconFromType = () => {
    return <i className={`mdi mdi-monitor ${imageIcon}`} />
  }

  renderDrawer = (prog: { url: string, programTitle: string, programDescription: string, image?: { url: string } }) => {
    const { playMedia } = this.props

    const onClick = prog.url
                  ? () => playMedia(prog.url, prog.programTitle, prog.programDescription, true, prog.image && prog.image.url)
                  : null

    return (
      <div className={drawer}>
        <div onClick={onClick} className={drawerImage}>
          <ResilientImage src={prog.image && prog.image.url}>
            {this.renderIconFromType()}
          </ResilientImage>
        </div>
        <div className={drawerContent}>{prog.programDescription}</div>
      </div>
    )
  }

  renderContent () {
    const { data } = this.props
    const { loading, program } = data
    const { drawerStates } = this.state

    if (loading) {
      return null
    }

    return (
      <div className={content}>
        {
          program.filter(p => p && p.url).map(prog => {
            const drawerOpen = drawerStates[prog.id]
            const itemClass = drawerOpen ? `${liveStreamItem} ${open}` : liveStreamItem
            return (
              <div className={itemClass} key={prog.id}>
                <div className={collapser} onClick={() => this.toggleDrawer(prog.id)}>
                  <div className={programTime}>{moment(prog.date).format('l LT')}</div>
                  <div className={programTitle}>{prog.programTitle}</div>
                  <div className={collapserIconContainer}><i className={`mdi mdi-chevron-down ${collapserIcon}`} /></div>
                </div>
                {this.renderDrawer(prog)}
              </div>
            )
          })
        }
      </div>
    )
  }

  render () {
    return (
      <div className={liveStream}>
        {this.renderLoading()}
        {this.renderContent()}
      </div>
    )
  }
}

const withHomeQuery = graphql(
  Query,
)

const mapDispatchToProps = (dispatch: Dispatch<AppState>): DispatchProps => ({
  playMedia: (mediaUrl, mediaTitle, mediaDescription, isVideo, imageUrl) =>
      dispatch(playMedia({ mediaUrl, mediaTitle, mediaDescription, isVideo, imageUrl })),
})

const withRedux = connect(null, mapDispatchToProps)

export default withHomeQuery(withRedux(LiveStreamBase))
