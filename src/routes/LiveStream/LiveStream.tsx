
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
import { HomeRouteQuery } from 'helpers/graphql-types'
import analytics from 'helpers/analytics'

import AppState from 'types/AppState'
import Category from 'types/Category'

type Props = {}

class HomeRouteBase extends React.Component<Props> {
  render () {
    return (
      <div className={liveStream}>
      </div>
    )
  }
}

const withHomeQuery = graphql(
  Query,
)

export default withHomeQuery(HomeRouteBase)
