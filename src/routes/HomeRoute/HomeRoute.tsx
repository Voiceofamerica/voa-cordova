
import * as React from 'react'
import { RouteComponentProps } from 'react-router'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { graphql, ChildProps } from 'react-apollo'
import * as moment from 'moment'

import Card from '@voiceofamerica/voa-shared/components/Card'
import { ready } from '@voiceofamerica/voa-shared/helpers/startup'
import Ticket from '@voiceofamerica/voa-shared/components/Ticket'
import BottomNav, { IconItem, RoundItem } from '@voiceofamerica/voa-shared/components/BottomNav'
import TopNav, { TopNavItem } from '@voiceofamerica/voa-shared/components/TopNav'

import { homeRoute, row, content, contentLoading, searchButton, topNav, ticketIcon } from './HomeRoute.scss'
import * as Query from './HomeRoute.graphql'
import { HomeRouteQuery } from 'helpers/graphql-types'
import analytics from 'helpers/analytics'

import AppState from 'types/AppState'
import Category from 'types/Category'
import ArticleBlurb from '@voiceofamerica/voa-shared/types/ArticleBlurb'

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

interface State {
  startupDone: boolean
}

class HomeRouteBase extends React.Component<Props, State> {
  state: State = {
    startupDone: false,
  }

  componentDidMount () {
    analytics.trackHome()
    ready().then(() => this.setState({ startupDone: true }))
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
    const { startupDone } = this.state
    if (!data.loading && startupDone) {
      return null
    }

    return (
      <div style={{ paddingTop: 100, display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'flex-start', height: '100%', zIndex: 1 }}>
        <div style={{ alignContent: 'flex-start', color: '#FFF', fontSize: '10vw', backgroundColor: 'transparent', textAlign: 'center' }}>
          装载...
        </div>
      </div>
    )
  }

  renderIcon = (blurb, className?: string) => {
    if (blurb.video && blurb.video.url) {
      return <i className={`mdi mdi-monitor ${className}`} />
    } else if (blurb.audio && blurb.audio.url) {
      return <i className={`mdi mdi-headphones ${className}`} />
    } else {
      return null
    }
  }

  renderHero () {
    const { data } = this.props
    const { startupDone } = this.state
    const { loading, content } = data
    if (loading || !startupDone || content.length < 1) {
      return null
    }

    const blurb = content[0]

    return (
      <Row>
        <Card
          onPress={() => this.goToArticle(blurb.id)}
          title={<span>{this.renderIcon(blurb)} {blurb.title}</span>}
          minorText={moment(blurb.pubDate).fromNow()}
          imageUrl={blurb.image && blurb.image.url}
          factor={1}
        />
      </Row>
    )
  }

  renderSecondary () {
    const { data } = this.props
    const { startupDone } = this.state
    const { loading, content } = data
    if (loading || !startupDone || content.length < 2) {
      return null
    }

    return (
      <Row>
        {
          content.slice(1, 3).map((blurb, idx) => (
            <Card
              key={blurb.id}
              onPress={() => this.goToArticle(blurb.id)}
              title={<span>{this.renderIcon(blurb)} {blurb.title}</span>}
              minorText={moment(blurb.pubDate).fromNow()}
              imageUrl={blurb.image && blurb.image.url}
              factor={2}
            />
          ))
        }
      </Row>
    )
  }

  renderRest () {
    const { data } = this.props
    const { startupDone } = this.state
    const { loading, content } = data

    if (loading || !startupDone || content.length < 4) {
      return null
    }

    return (
      content.slice(3).map((blurb, idx) => (
        <Row key={blurb.id}>
          <Ticket
            onPress={() => this.goToArticle(blurb.id)}
            title={blurb.title}
            minorText={moment(blurb.pubDate).fromNow()}
            imageUrl={blurb.image && blurb.image.url}
            icon={this.renderIcon(blurb, ticketIcon)}
          />
        </Row>
      ))
    )
  }

  renderSearchButton () {
    return (
      <div className={searchButton} onClick={() => this.goTo('/search')}>
        <i className='mdi mdi-magnify' />
        搜索
      </div>
    )
  }

  renderContent () {
    const { data } = this.props
    const { startupDone } = this.state
    const className = (data.loading || !startupDone) ? `${content} ${contentLoading}` : content

    return (
      <div className={className}>
        { this.renderSearchButton() }
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
        outputData.content = outputData.content.filter(c => c).map(c => {
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
