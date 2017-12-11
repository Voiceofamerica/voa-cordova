
import * as React from 'react'
import { RouteComponentProps } from 'react-router'
import { graphql, ChildProps, QueryOpts } from 'react-apollo'
import * as moment from 'moment'

import ResilientImage from '@voiceofamerica/voa-shared/components/ResilientImage'
import BottomNav, { IconItem } from '@voiceofamerica/voa-shared/components/BottomNav'

import { articleRoute, container, heading, articleText } from './ArticleRoute.scss'
import * as Query from './ArticleRoute.graphql'
import { ArticleRouteQuery, ArticleRouteQueryVariables } from 'helpers/graphql-types'

export interface Params {
  id: string
}

type OwnProps = RouteComponentProps<Params>
type Props = ChildProps<OwnProps, ArticleRouteQuery>

class HomeRouteBase extends React.Component<Props> {
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

  renderImage () {
    const { image } = this.props.data.content[0]
    if (!image || !image.url) {
      return null
    }

    return <ResilientImage src={image.url} />
  }

  renderHeading () {
    const { title, pubDate } = this.props.data.content[0]
    const authorNames = [] // authors
      .map(auth => auth.name)
      .map(name => `${name.first} ${name.last}`)

    return (
      <div className={heading}>
        <h1>{title}</h1>
        <hr />
        {
          authorNames.map((name, idx) => (
            <h2 key={idx}>{name}</h2>
          ))
        }
        <h3>{moment(pubDate).format('lll')}</h3>
      </div>
    )
  }

  renderUpdatedDate () {
    const { lastUpdated, pubDate } = this.props.data.content[0]
    const published = moment(pubDate)
    const updated = moment(lastUpdated)

    if (published.diff(updated) === 0) {
      return null
    }

    return (
      <div style={{ fontWeight: 'bold' }}>
        Updated {updated.format('lll')}
      </div>
    )
  }

  renderArticle () {
    const { data } = this.props
    if (!(data.content && data.content[0])) {
      return null
    }

    const article = data.content[0]

    const paragraphs = article.content.split(/\n/g)

    return (
      <div className={container}>
        {this.renderImage()}
        {this.renderHeading()}
        <div className={articleText}>
          {
            paragraphs.map((text, index) => (
              <p key={index}>{text}</p>
            ))
          }
          {this.renderUpdatedDate()}
        </div>
      </div>
    )
  }

  renderBottomNav () {
    const { history } = this.props

    return (
      <BottomNav>
        <IconItem onClick={() => history.goBack()}>
          <i className='mdi mdi-chevron-left' />
        </IconItem>
        <IconItem>
          <i className='mdi mdi-share' />
        </IconItem>
        <IconItem>
          <i className='mdi mdi-star-outline' />
        </IconItem>
        <IconItem>
          <i className='mdi mdi-download' />
        </IconItem>
        <IconItem>
          <i className='mdi mdi-account-settings-variant' />
        </IconItem>
      </BottomNav>
    )
  }

  render () {
    return (
      <div className={articleRoute}>
        { this.renderArticle() }
        { this.renderLoading() }
        { this.renderBottomNav() }
      </div>
    )
  }
}

export default graphql(
  Query,
  {
    options: (ownProps: OwnProps): QueryOpts<ArticleRouteQueryVariables> => ({
      variables: {
        id: parseInt(ownProps.match.params.id, 10),
      },
    }),
  },
)(HomeRouteBase)
