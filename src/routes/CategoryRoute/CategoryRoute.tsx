
import * as React from 'react'
import { RouteComponentProps } from 'react-router'
import { compose } from 'redux'
import { graphql, ChildProps, QueryOpts } from 'react-apollo'
import * as moment from 'moment'

import Card from '@voiceofamerica/voa-shared/components/Card'
import SecondaryCard from '@voiceofamerica/voa-shared/components/SecondaryCard'
import Ticket from '@voiceofamerica/voa-shared/components/Ticket'
import SvgIcon from '@voiceofamerica/voa-shared/components/SvgIcon'

import Loader from 'components/Loader'
import PullToRefresh from 'components/PullToRefresh'

import { homeRoute, row, content, searchButton, iconCircle } from './CategoryRoute.scss'
import * as Query from './CategoryRoute.graphql'
import { CategoryRouteQuery, CategoryRouteQueryVariables } from 'helpers/graphql-types'
import analytics, { AnalyticsProps } from 'helpers/analytics'
import { truncateTitleText } from 'helpers/truncation'
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

  renderIcon = (blurb: CategoryRouteQuery['content'][0]) => {
    if (blurb.video && blurb.video.url) {
      return <SvgIcon src={require('svg/video.svg')} />
    } else if (blurb.audio && blurb.audio.url) {
      return <SvgIcon src={require('svg/audio.svg')} />
    } else if (blurb.photoGallery && blurb.photoGallery.length > 0) {
      return <SvgIcon src={require('svg/gallery.svg')} />
    } else {
      return null
    }
  }

  renderIconWithCircle = (blurb: CategoryRouteQuery['content'][0]) => {
    const icon = this.renderIcon(blurb)

    if (icon) {
      return (
        <div className={iconCircle}>
          {this.renderIcon(blurb)}
        </div>
      )
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
          imageUrl={blurb.image && blurb.image.hero}
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
              imageUrl={blurb.image && blurb.image.thumb}
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
            imageUrl={blurb.image && blurb.image.tiny}
            icon={this.renderIconWithCircle(blurb)}
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
    }),
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
