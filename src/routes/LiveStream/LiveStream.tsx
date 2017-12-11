
import * as React from 'react'
import { RouteComponentProps } from 'react-router'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { graphql, ChildProps } from 'react-apollo'

import Card from '@voiceofamerica/voa-shared/components/Card'
import Ticket from '@voiceofamerica/voa-shared/components/Ticket'
import BottomNav, { IconItem, RoundItem } from '@voiceofamerica/voa-shared/components/BottomNav'
import TopNav, { TopNavItem } from '@voiceofamerica/voa-shared/components/TopNav'

import { liveStream } from './LiveStream.scss'
import * as Query from './LiveStream.graphql'
import { LiveStreamQuery } from 'helpers/graphql-types'
import analytics from 'helpers/analytics'

import AppState from 'types/AppState'
import Category from 'types/Category'

type Props = ChildProps<RouteComponentProps<void>, LiveStreamQuery>

class LiveStreamBase extends React.Component<Props> {
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

  renderContent () {
    const { data } = this.props

    if (data.loading) {
      return null
    }

    return (
      <div></div>
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

export default withHomeQuery(LiveStreamBase)
