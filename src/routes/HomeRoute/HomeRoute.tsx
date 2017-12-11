
import * as React from 'react'
import { RouteComponentProps } from 'react-router'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { graphql, ChildProps } from 'react-apollo'

import Card from '@voiceofamerica/voa-shared/components/Card'
import Ticket from '@voiceofamerica/voa-shared/components/Ticket'
import BottomNav, { IconItem, RoundItem } from '@voiceofamerica/voa-shared/components/BottomNav'
import TopNav, { TopNavItem } from '@voiceofamerica/voa-shared/components/TopNav'

import { homeRoute, row, content, contentLoading, topNav } from './HomeRoute.scss'
import * as Query from './HomeRoute.graphql'
import { HomeRouteQuery } from 'helpers/graphql-types'
import analytics from 'helpers/analytics'

import AppState from 'types/AppState'
import Category from 'types/Category'

const Row = ({ children }: React.Props<any>) => (
  <div className={row}>
    { children }
  </div>
)

interface StateProps {
  categories: Category[]
}

type QueryProps = ChildProps<RouteComponentProps<void>, HomeRouteQuery>

type Props = QueryProps & StateProps

class HomeRouteBase extends React.Component<Props> {
  componentDidMount () {
    analytics.trackHome()
  }

  goTo (route: string) {
    const { history } = this.props
    history.push(route)
  }

  goToArticle (id: number) {
    this.goTo(`/article/${id}`)
  }

  goToSettings () {
    this.goTo('/settings')
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
    const { data } = this.props
    const { loading, content } = data
    if (loading || content.length < 1) {
      return null
    }

    const blurb = content[0]

    return (
      <Row>
        <Card onPress={() => this.goToArticle(blurb.id)} blurb={blurb} factor={1} />
      </Row>
    )
  }

  renderSecondary () {
    const { data } = this.props
    const { loading, content } = data
    if (loading || content.length < 2) {
      return null
    }

    return (
      <Row>
        {
          content.slice(1, 3).map((blurb, idx) => (
            <Card key={idx} onPress={() => this.goToArticle(blurb.id)} blurb={blurb} factor={2} />
          ))
        }
      </Row>
    )
  }

  renderRest () {
    const { data } = this.props
    const { loading, content } = data

    if (loading || content.length < 4) {
      return null
    }

    return (
      content.slice(3).map((blurb, idx) => (
        <Row key={idx}>
          <Ticket onPress={() => this.goToArticle(blurb.id)} blurb={blurb} />
        </Row>
      ))
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

const pathRgx = /\/(.{36})((?:_tv)?)[^\.]*\.(.*)/
const mapImageUrl = (url: string, params: string = 'w300') => {
  const parsedUrl = new URL(url)
  const pathParts = pathRgx.exec(parsedUrl.pathname)
  const guid = pathParts[1]
  const tv = pathParts[2]
  const ext = pathParts[3]
  console.log(parsedUrl.pathname)
  parsedUrl.pathname = `${guid}${tv}_${params}.${ext}`
  return parsedUrl.toString()
}

const withHomeQuery = graphql(
  Query,
  {
    props: ({ data }) => {
      let outputData = data as (typeof data) & HomeRouteQuery
      if (!data.loading) {
        outputData.content = outputData.content.map(c => {
          return {
            ...c,
            image: c.image && {
              ...c.image,
              url: mapImageUrl(c.image.url),
            },
          }
        })
      }

      return { data: outputData }
    },
  },
)

export default withHomeQuery(HomeRouteBase)
