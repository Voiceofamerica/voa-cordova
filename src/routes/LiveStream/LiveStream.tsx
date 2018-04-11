
import * as React from 'react'
import { RouteComponentProps } from 'react-router'
import { connect, Dispatch } from 'react-redux'
import { graphql, ChildProps } from 'react-apollo'
import * as moment from 'moment'

import ResilientImage from '@voiceofamerica/voa-shared/components/ResilientImage'

import { LiveStreamQuery } from 'helpers/graphql-types'
import analytics, { AnalyticsProps } from 'helpers/analytics'
import playMedia from 'redux-store/thunks/playMediaFromPsiphon'

import AppState from 'types/AppState'

import Loader from 'components/Loader'
import ErrorBoundary from 'components/ErrorBoundary'
import NotificationSwitch from 'containers/NotificationSwitch'
import { liveStreamLabels } from 'labels'

import * as Query from './LiveStream.graphql'
import {
  liveStream,
  content,
  programTime,
  liveStreamItem,
  programTitle,
  collapser,
  collapserIconContainer,
  collapserIcon,
  drawer,
  drawerImage,
  imageIcon,
  drawerContent,
  textContent,
  toggleContent,
  toggleText,
  toggler,
  open,
  loadingText,
} from './LiveStream.scss'

interface DispatchProps {
  playMedia: (url: string, title: string, description: string, isVideo: boolean, imageUrl: string) => void
}

type Props = ChildProps<RouteComponentProps<void>, LiveStreamQuery> & DispatchProps & AnalyticsProps

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

  renderIconFromType = () => {
    return <i className={`mdi mdi-monitor ${imageIcon}`} />
  }

  deviceSupportsNotifications = () => {
    if (typeof device === 'undefined') {
      return false
    }

    const version = device.version.split(/\.|\-/).map(val => parseInt(val, 10))
    return device.platform !== 'Android' || version[0] > 4 || (version[0] === 4 && version[1] > 3)
  }

  renderDrawer = (prog: LiveStreamQuery['program'][0]) => {
    const { playMedia } = this.props

    const onClick = prog.url
                  ? () => playMedia(prog.url, prog.programTitle, prog.programDescription, true, prog.image && prog.image.tiny)
                  : null

    const showSwitch = this.deviceSupportsNotifications()

    return (
      <div className={drawer}>
        <div onClick={onClick} className={drawerImage}>
          <ResilientImage src={prog.image && prog.image.tiny}>
            {this.renderIconFromType()}
          </ResilientImage>
        </div>
        <div className={drawerContent}>
          <div className={textContent}>{prog.programDescription}</div>
          {
            showSwitch
            ? <div className={toggleContent}>
                <div className={toggleText}>{liveStreamLabels.notifyMe}</div>
                <div className={toggler}>
                  <NotificationSwitch notificationId={prog.id} title={prog.programTitle} time={moment(prog.date)} />
                </div>
              </div>
            : null
          }
        </div>
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
        <Loader className={loadingText} data={this.props.data}>
          <ErrorBoundary>
            {this.renderContent()}
          </ErrorBoundary>
        </Loader>
      </div>
    )
  }
}

const withAnalytics = analytics<Props>(({ data }) => ({
  state: 'Live Stream Schedule',
  title: 'Live Stream Schedule',
  skip: data.loading,
}))

const withHomeQuery = graphql(
  Query,
)

const mapDispatchToProps = (dispatch: Dispatch<AppState>): DispatchProps => ({
  playMedia: (mediaUrl, mediaTitle, mediaDescription, isVideo, imageUrl) =>
      dispatch(playMedia({ mediaUrl, mediaTitle, mediaDescription, isVideo, imageUrl })),
})

const withRedux = connect(null, mapDispatchToProps)

export default withHomeQuery(withRedux(withAnalytics(LiveStreamBase)))
