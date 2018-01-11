
import * as React from 'react'
import { RouteComponentProps } from 'react-router'
import { compose } from 'redux'
import { graphql, ChildProps } from 'react-apollo'
import * as moment from 'moment'

import Card from '@voiceofamerica/voa-shared/components/Card'
import SecondaryCard from '@voiceofamerica/voa-shared/components/SecondaryCard'
import Ticket from '@voiceofamerica/voa-shared/components/Ticket'

import Loader from 'components/Loader'
import PullToRefresh from 'components/PullToRefresh'

import { homeRoute, row, contentArea, defaultText, ticketIcon } from './BreakingNews.scss'
import * as Query from './BreakingNewsRoute.graphql'
import { BreakingNewsRouteQuery } from 'helpers/graphql-types'
import analytics, { AnalyticsProps } from 'helpers/analytics'
import { mapImageUrl } from 'helpers/image'
import { breakingNewsLabels } from 'labels'

type OwnProps = RouteComponentProps<void>
type QueryProps = ChildProps<RouteComponentProps<void>, BreakingNewsRouteQuery>

type Props = QueryProps & OwnProps & AnalyticsProps

class HomeRouteBase extends React.Component<Props> {

  goTo (route: string) {
    const { history } = this.props
    history.push(route)
  }

  goToArticle (id: number) {
    this.goTo(`/article/${id}`)
  }

  renderIcon = (blurb: BreakingNewsRouteQuery['breakingNews'][0], className?: string) => {
    if (blurb.video && blurb.video.url) {
      return <i className={`mdi mdi-monitor ${className}`} />
    } else if (blurb.audio && blurb.audio.url) {
      return <i className={`mdi mdi-headphones ${className}`} />
    } else if (blurb.photoGallery && blurb.photoGallery.length > 0) {
      const { photoGallery } = blurb
      const countNumber = photoGallery.reduce((total, gallery) => total + gallery.photo.length, 0)
      const count = countNumber < 9 ? `${countNumber}` : '9-plus'
      return <i className={`mdi mdi-numeric-${count}-box-multiple-outline ${className}`} />
    } else {
      return null
    }
  }

  renderHero () {
    const { data } = this.props
    const { breakingNews } = data

    if (!breakingNews || breakingNews.length < 1) {
      return null
    }

    const blurb = breakingNews[0]

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
    const { breakingNews } = data

    if (!breakingNews || breakingNews.length < 2) {
      return null
    }

    return (
      <div className={row}>
        {
          breakingNews.slice(1, 3).map((blurb) => (
            <SecondaryCard
              key={blurb.id}
              onPress={() => this.goToArticle(blurb.id)}
              title={<span>{this.renderIcon(blurb)} {blurb.title}</span>}
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
    const { breakingNews } = data

    if (!breakingNews || breakingNews.length < 4) {
      return null
    }

    return (
      breakingNews.slice(3).map((blurb) => (
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

  renderArticles () {
    return (
      <div>
        { this.renderHero() }
        { this.renderSecondary() }
        { this.renderRest() }
      </div>
    )
  }

  renderDefault () {
    return (
      <div className={defaultText}>
        {breakingNewsLabels.noNews}
      </div>
    )
  }

  renderContent () {
    const { data } = this.props
    const { breakingNews } = data
    const content = breakingNews && breakingNews[0]
                  ? this.renderArticles()
                  : this.renderDefault()

    return (
      <div className={contentArea}>
        <PullToRefresh data={data}>
          { content }
        </PullToRefresh>
      </div>
    )
  }

  render () {
    const { data } = this.props

    return (
      <div className={homeRoute}>
        <Loader data={data} hasContent={data.breakingNews && data.breakingNews.length > 0}>
          { this.renderContent() }
        </Loader>
      </div>
    )
  }
}

const withHomeQuery = graphql(
  Query,
  {
    props: ({ data }) => {
      let outputData = data as (typeof data) & BreakingNewsRouteQuery
      if (!data.loading && !data.error) {
        outputData.breakingNews = outputData.breakingNews.filter(c => c).map(c => {
          return {
            ...c,
            image: c.image && {
              ...c.image,
              url: mapImageUrl(c.image.url, 'w300'),
            },
          }
        })
      }

      return { data: outputData }
    },
  },
)

const withAnalytics = analytics<Props>(({ data }) => ({
  state: 'Breaking News',
  title: 'Breaking News',
  skip: data.loading,
}))

export default compose(
  withHomeQuery,
  withAnalytics,
)(HomeRouteBase)
