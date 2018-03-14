
import * as React from 'react'
import { RouteComponentProps } from 'react-router'
import { graphql, ChildProps } from 'react-apollo'
import * as moment from 'moment'

import Card from '@voiceofamerica/voa-shared/components/Card'
import SecondaryCard from '@voiceofamerica/voa-shared/components/SecondaryCard'
import Ticket from '@voiceofamerica/voa-shared/components/Ticket'

import { homeRoute, row, content, searchButton, ticketIcon } from './HomeRoute.scss'
import * as Query from './HomeRoute.graphql'
import { HomeRouteQuery } from 'helpers/graphql-types'
import { mapImageUrl } from 'helpers/image'
import { truncateTitleText } from 'helpers/truncation'
import analytics, { AnalyticsProps } from 'helpers/analytics'

import Loader from 'components/Loader'
import PullToRefresh from 'components/PullToRefresh'
import { homeLabels } from 'labels'

type QueryProps = ChildProps<RouteComponentProps<void>, HomeRouteQuery>

type Props = QueryProps & AnalyticsProps

interface State {
}

class HomeRouteBase extends React.Component<Props, State> {
  state: State = {
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

  renderIcon = (blurb: HomeRouteQuery['content'][0], className?: string) => {
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
    const { content } = data
    if (!content || content.length < 1) {
      return null
    }

    const blurb = content[0]
    const icon = this.renderIcon(blurb)
    const hasIcon = icon !== null ? true : false

    return (
      <div className={row} style={{ marginBottom: '1.5vw' }}>
        <Card
          onPress={() => this.goToArticle(blurb.id)}
          icon={icon}
          title={truncateTitleText(blurb.title, hasIcon)}
          minorText={moment(blurb.pubDate).format('lll')}
          imageUrl={blurb.image && blurb.image.url}
          factor={1}
        />
      </div>
    )
  }

  renderSecondary () {
    const { data } = this.props
    const { content } = data
    if (!content || content.length < 2) {
      return null
    }

    return (
      <div className={row}>
        {
          content.slice(1, 3).map((blurb) => (
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
    const { content } = data

    if (!content || content.length < 4) {
      return null
    }

    return (
      content.slice(3).map((blurb) => (
        <div className={row} key={blurb.id}>
          <Ticket
            onPress={() => this.goToArticle(blurb.id)}
            title={blurb.title}
            minorText={moment(blurb.pubDate).format('lll')}
            imageUrl={blurb.image && blurb.image.url}
            icon={this.renderIcon(blurb, ticketIcon)}
          />
        </div>
      ))
    )
  }

  renderSearchButton () {
    return (
      <div className={row}>
        <button className={searchButton} onClick={() => this.goTo('/search')}>
          {homeLabels.search}
        </button>
      </div>
    )
  }

  renderContent () {
    const { data } = this.props

    return (
      <div className={content}>
        <PullToRefresh data={data}>
          { this.renderSearchButton() }
          { this.renderHero() }
          { this.renderSecondary() }
          { this.renderRest() }
        </PullToRefresh>
      </div>
    )
  }

  render () {
    const { data } = this.props

    return (
      <div className={homeRoute}>
        <Loader data={data} hasContent={data.content && data.content.length > 0}>
          { this.renderContent() }
        </Loader>
      </div>
    )
  }
}

const withAnalytics = analytics<QueryProps>(({ data }) => ({
  state: 'Home',
  title: 'Home',
  skip: data.loading,
}))

const withHomeQuery = graphql(
  Query,
  {
    props: ({ data }) => {
      let outputData = data as (typeof data) & HomeRouteQuery
      if (!data.loading && !data.error) {
        outputData.content = outputData.content.filter(c => c).map(c => {
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
    options: {
      fetchPolicy: 'cache-first',
    },
  },
)

export default withHomeQuery(withAnalytics(HomeRouteBase))
