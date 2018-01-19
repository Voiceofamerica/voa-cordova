
import * as React from 'react'
import { RouteComponentProps } from 'react-router'
import { compose } from 'redux'
import { graphql, ChildProps, QueryOpts } from 'react-apollo'
import * as moment from 'moment'

import Card from '@voiceofamerica/voa-shared/components/Card'
import SecondaryCard from '@voiceofamerica/voa-shared/components/SecondaryCard'
import Ticket from '@voiceofamerica/voa-shared/components/Ticket'

import Loader from 'components/Loader'
import PullToRefresh from 'components/PullToRefresh'

import { homeRoute, row, content, searchButton, ticketIcon } from './CategoryRoute.scss'
import * as Query from './CategoryRoute.graphql'
import { CategoryRouteQuery, CategoryRouteQueryVariables } from 'helpers/graphql-types'
import analytics, { AnalyticsProps } from 'helpers/analytics'
import { mapImageUrl } from 'helpers/image'
import { homeLabels } from 'labels'

export interface Params {
  category: string
}

export interface State {
  categoryLoaded: boolean
}

type OwnProps = RouteComponentProps<Params>
type QueryProps = ChildProps<RouteComponentProps<void>, CategoryRouteQuery>

type Props = QueryProps & OwnProps & AnalyticsProps

class HomeRouteBase extends React.Component<Props, State> {
  state: State = {
    categoryLoaded: false,
  }

  goTo (route: string) {
    const { history } = this.props
    history.push(route)
  }

  goToArticle (id: number) {
    this.goTo(`/article/${id}`)
  }

  componentWillReceiveProps (nextProps: Props) {
    const { data: { variables: { category: newCategory }, loading } } = nextProps
    const { data: { variables: { category: oldCategory } } } = this.props
    if (newCategory !== oldCategory) {
      this.setState({ categoryLoaded: false })
    } else if (!loading) {
      this.setState({ categoryLoaded: true })
    }
  }

  renderIcon = (blurb: CategoryRouteQuery['content'][0], className?: string) => {
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

    return (
      <div className={row} style={{ marginBottom: '1.5vw' }}>
        <Card
          onPress={() => this.goToArticle(blurb.id)}
          title={<span>{this.renderIcon(blurb)} {blurb.title}</span>}
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
    const { category } = this.props.match.params
    return (
      <div className={row}>
        <button className={searchButton} onClick={() => this.goTo(`/search/${category}`)}>
          <i className='mdi mdi-magnify' />
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
    const { categoryLoaded } = this.state

    return (
      <div className={homeRoute}>
        <Loader data={data} hasContent={data.content && data.content.length > 0 && categoryLoaded}>
          { this.renderContent() }
        </Loader>
      </div>
    )
  }
}

const withHomeQuery = graphql(
  Query,
  {
    options: (ownProps: OwnProps): QueryOpts<CategoryRouteQueryVariables> => ({
      variables: {
        category: parseInt(ownProps.match.params.category, 10),
      },
      fetchPolicy: 'cache-first',
    }),
    props: ({ data }) => {
      let outputData = data as (typeof data) & CategoryRouteQuery
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
  },
)

const withAnalytics = analytics<Props>(({ match }, { match: oldMatch }) => ({
  state: 'Category Section',
  title: 'Category Section',
  section: match.params.category,
  skip: match.params.category === (oldMatch && oldMatch.params && oldMatch.params.category),
}))

export default compose(
  withHomeQuery,
  withAnalytics,
)(HomeRouteBase)
