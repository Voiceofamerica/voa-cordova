
import * as React from 'react'
import { compose } from 'redux'
import { connect, Dispatch } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import { graphql, ChildProps, QueryOpts } from 'react-apollo'
import * as moment from 'moment'

import ResilientImage from '@voiceofamerica/voa-shared/components/ResilientImage'
import BottomNav, { IconItem } from '@voiceofamerica/voa-shared/components/BottomNav'
import Card from '@voiceofamerica/voa-shared/components/Card'

import { ArticleRouteQuery, ArticleRouteQueryVariables } from 'helpers/graphql-types'
import playMedia from 'redux-store/actions/playMedia'

import { articleRoute, container, heading, articleText } from './ArticleRoute.scss'
import * as Query from './ArticleRoute.graphql'

export interface Params {
  id: string
}

interface DispatchProps {
  playMedia: (url: string, title: string, description: string) => void
}

type OwnProps = RouteComponentProps<Params>
type QueryProps = ChildProps<OwnProps, ArticleRouteQuery>
type Props = QueryProps & DispatchProps

class HomeRouteBase extends React.Component<Props> {
  renderLoading () {
    const { data } = this.props
    if (!data.loading) {
      return null
    }

    return (
      <div style={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center', height: '100%', zIndex: 1 }}>
        <div style={{ alignContent: 'center', color: '#FFF', fontSize: '10vw', backgroundColor: 'transparent', textAlign: 'center' }}>
          装载...
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
    const { title, pubDate, authors } = this.props.data.content[0]
    const authorNames = authors
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
        {updated.format('lll')}更新
      </div>
    )
  }

  renderVideo () {
    const { data, playMedia } = this.props
    const article = data.content[0]
    const { video } = article

    if (!video || !video.url) {
      return null
    }

    return (
      <Card onPress={() => playMedia(video.url, article.title, video.videoDescription)} blurb={{
        id: null,
        image: { url: video.thumbnail },
        title: '',
        pubDate: article.pubDate,
      }} factor={3} />
    )
  }

  renderMedia () {
    return (
      <div style={{ display: 'block', float: 'left', width: '33vw', marginRight: 10 }}>
        {this.renderVideo()}
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
              <p key={index}>
                {index === 0 ? this.renderMedia() : null}
                {text}
              </p>
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

const mapDispatchToProps = (dispatch: Dispatch<any>): DispatchProps => {
  return {
    playMedia: (mediaUrl, mediaTitle, mediaDescription) => dispatch(playMedia({ mediaUrl, mediaTitle, mediaDescription })),
  }
}

const withQuery = graphql(
  Query,
  {
    options: (ownProps: OwnProps): QueryOpts<ArticleRouteQueryVariables> => ({
      variables: {
        id: parseInt(ownProps.match.params.id, 10),
      },
    }),
  },
)

const withRedux = connect(null, mapDispatchToProps)

export default compose(
  withQuery,
  withRedux,
)(HomeRouteBase)
