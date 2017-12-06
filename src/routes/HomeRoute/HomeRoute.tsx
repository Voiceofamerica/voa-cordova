
import * as React from 'react'
import { RouteComponentProps } from 'react-router'
import { graphql, ChildProps } from 'react-apollo'

import { ready } from '@voiceofamerica/voa-shared/helpers/startup'
import Card from '@voiceofamerica/voa-shared/components/Card'
import Ticket from '@voiceofamerica/voa-shared/components/Ticket'
import BottomNav, { IconItem, RoundItem } from '@voiceofamerica/voa-shared/components/BottomNav'
import ArticleBlurb from '@voiceofamerica/voa-shared/types/ArticleBlurb'

import { homeRoute, row, loadMore, content, contentLoading, topNav } from './HomeRoute.scss'
import * as Query from './HomeRoute.graphql'
import { HomeRouteQuery } from 'helpers/graphql-types'
import analytics from 'helpers/analytics'

const Row = ({ children }: React.Props<any>) => (
  <div className={row}>
    { children }
  </div>
)

type Props = ChildProps<RouteComponentProps<void>, HomeRouteQuery>

class HomeRouteBase extends React.Component<Props> {
  componentDidMount () {
    analytics.trackHome()
  }

  renderLoading () {
    const { data } = this.props
    if (!data.loading) {
      return null
    }

    return (
      <div style={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center', height: '100%', zIndex: 1 }}>
        <div style={{ alignContent: 'center', color: '#FFF', fontSize: '10vw', backgroundColor: 'transparent', textAlign: 'center' }}>
          Loading...
        </div>
      </div>
    )
  }

  renderHero () {
    const { history, data } = this.props
    const { loading, articles } = data
    if (loading || articles.length < 1) {
      return null
    }

    const blurb = articles[0]

    return (
      <Row>
        <Card onPress={() => history.push(`/article/${blurb.id}`)} blurb={blurb} factor={1} />
      </Row>
    )
  }

  renderSecondary () {
    const { history, data } = this.props
    const { loading, articles } = data
    if (loading || articles.length < 2) {
      return null
    }

    return (
      <Row>
        {
          articles.slice(1, 3).map((blurb, idx) => (
            <Card key={idx} onPress={() => history.push(`/article/${blurb.id}`)} blurb={blurb} factor={2} />
          ))
        }
      </Row>
    )
  }

  renderRest () {
    const { history, data } = this.props
    const { loading, articles } = data

    if (loading || articles.length < 4) {
      return null
    }

    return (
      articles.slice(3).map((blurb, idx) => (
        <Row key={idx}>
          <Ticket onPress={() => history.push(`/article/${blurb.id}`)} blurb={blurb} />
        </Row>
      ))
    )
  }

  renderTopNav () {
    const { history } = this.props

    return (
      <div className={topNav}>
      </div>
    )
  }

  renderBottomNav () {
    const { history } = this.props

    return (
      <BottomNav>
        <IconItem active>
          <i className='mdi mdi-home-outline' />
        </IconItem>
        <IconItem>
          <i className='mdi mdi-flash-outline' />
        </IconItem>
        <RoundItem>
          <i className='mdi mdi-play-circle-outline' />
        </RoundItem>
        <IconItem>
          <i className='mdi mdi-radio-tower' />
        </IconItem>
        <IconItem onClick={() => history.push(`/settings`)}>
          <i className='mdi mdi-account-outline' />
        </IconItem>
      </BottomNav>
    )
  }

  renderContent () {
    const { data } = this.props
    const className = data.loading ? `${content} ${contentLoading}` : content

    return (
      <div className={className}>
        { this.renderHero() }
        { this.renderSecondary() }
        { this.renderRest() }
        { this.renderTopNav() }
        { this.renderBottomNav() }
      </div>
    )
  }

  render () {
    return (
      <div className={homeRoute}>
        { this.renderContent() }
        { this.renderLoading() }
      </div>
    )
  }
}

export default graphql(
  Query,
)(HomeRouteBase)
