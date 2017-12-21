
import * as React from 'react'
import { RouteComponentProps } from 'react-router'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { graphql, ChildProps, QueryOpts } from 'react-apollo'
import * as moment from 'moment'

import Card from '@voiceofamerica/voa-shared/components/Card'
import SecondaryCard from '@voiceofamerica/voa-shared/components/SecondaryCard'
import Ticket from '@voiceofamerica/voa-shared/components/Ticket'
import BottomNav, { IconItem, RoundItem } from '@voiceofamerica/voa-shared/components/BottomNav'
import TopNav, { TopNavItem } from '@voiceofamerica/voa-shared/components/TopNav'

import Loader from 'components/Loader'

import { homeRoute, row, content, contentLoading, searchButton, ticketIcon, topNav } from './CategoryRoute.scss'
import * as Query from './CategoryRoute.graphql'
import { CategoryRouteQuery, CategoryRouteQueryVariables } from 'helpers/graphql-types'
import analytics from 'helpers/analytics'

import AppState from 'types/AppState'
import Category from 'types/Category'

export interface Params {
  category: string
}

type OwnProps = RouteComponentProps<Params>
type QueryProps = ChildProps<RouteComponentProps<void>, CategoryRouteQuery>

type Props = QueryProps & OwnProps

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
    const { loading, error, content } = data

    if (loading || error || content.length < 1) {
      return null
    }

    const blurb = content[0]

    return (
      <div className={row} style={{ marginBottom: '1.5vw' }}>
        <Card
          onPress={() => this.goToArticle(blurb.id)}
          title={<span>{this.renderIcon(blurb)} {blurb.title}</span>}
          minorText={moment(blurb.pubDate).fromNow()}
          imageUrl={blurb.image && blurb.image.url}
          factor={1}
        />
      </div>
    )
  }

  renderSecondary () {
    const { data } = this.props
    const { loading, error, content } = data

    if (loading || error || content.length < 2) {
      return null
    }

    return (
      <div className={row}>
        {
          content.slice(1, 3).map((blurb, idx) => (
            <SecondaryCard
              key={blurb.id}
              onPress={() => this.goToArticle(blurb.id)}
              title={<span>{this.renderIcon(blurb)} {blurb.title}</span>}
              minorText={moment(blurb.pubDate).fromNow()}
              imageUrl={blurb.image && blurb.image.url}
              factor={2}
            />
          ))
        }
      </div>
    )
  }

  renderRest () {
    const { data } = this.props
    const { loading, error, content } = data

    if (loading || error || content.length < 4) {
      return null
    }

    return (
      content.slice(3).map((blurb, idx) => (
        <div className={row} key={blurb.id}>
          <Ticket
            onPress={() => this.goToArticle(blurb.id)}
            title={blurb.title}
            minorText={moment(blurb.pubDate).fromNow()}
            imageUrl={blurb.image && blurb.image.url}
            icon={this.renderIcon(blurb, ticketIcon)}
          />
        </div>
      ))
    )
  }

  renderSearchButton () {
    const { category } = this.props.match.params
    return (
      <div className={searchButton} onClick={() => this.goTo(`/search/${category}`)}>
        <i className='mdi mdi-magnify' />
        搜索
      </div>
    )
  }

  renderContent () {
    const { data } = this.props
    const className = data.loading ? `${content} ${contentLoading}` : content

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
        <Loader data={this.props.data}>
          { this.renderContent() }
        </Loader>
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
  parsedUrl.pathname = `${guid}${tv}_${params}.${ext}`
  return parsedUrl.toString()
}

const withHomeQuery = graphql(
  Query,
  {
    options: (ownProps: OwnProps): QueryOpts<CategoryRouteQueryVariables> => ({
      variables: {
        category: parseInt(ownProps.match.params.category, 10),
      },
    }),
    props: ({ data }) => {
      let outputData = data as (typeof data) & CategoryRouteQuery
      if (!data.loading && !data.error) {
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
