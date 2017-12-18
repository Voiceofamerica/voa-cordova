
import * as React from 'react'
import { compose } from 'redux'
import { connect, Dispatch } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import { graphql, ChildProps, QueryOpts } from 'react-apollo'
import * as moment from 'moment'

import ResilientImage from '@voiceofamerica/voa-shared/components/ResilientImage'
import BottomNav, { IconItem, RoundItem } from '@voiceofamerica/voa-shared/components/BottomNav'
import Card from '@voiceofamerica/voa-shared/components/Card'

import { ArticleRouteQuery, ArticleRouteQueryVariables } from 'helpers/graphql-types'
import playMedia from 'redux-store/thunks/playMediaFromBlob'
import toggleMediaDrawer from 'redux-store/actions/toggleMediaDrawer'

import MainBottomNav from 'containers/MainBottomNav'

import { articleRoute, container, heading, articleText, contentIcon, centerIcon, iconText, loadingText } from './ArticleRoute.scss'
import * as Query from './ArticleRoute.graphql'

export interface Params {
  id: string
}

interface DispatchProps {
  playMedia: (url: string, title: string, description: string, imageUrl?: string) => void
  toggleMediaPlayer: () => void
}

type OwnProps = RouteComponentProps<Params>
type QueryProps = ChildProps<OwnProps, ArticleRouteQuery>
type Props = QueryProps & DispatchProps

class ArticleRouteBase extends React.Component<Props> {
  renderLoadingOrError () {
    const { data } = this.props
    if (!data.loading && !data.error) {
      return null
    }

    return (
      <div className={loadingText}>
        装载...
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
      <Card
        style={{ display: 'inline-block', width: '30vw' }}
        onPress={() => playMedia(video.url, article.title, video.videoDescription, video.thumbnail)}
        title=''
        imageUrl={video.thumbnail}
        minorText=''
        factor={3}
        icon={<i className={`mdi mdi-monitor ${contentIcon}`} />}
      />
    )
  }

  renderAudio () {
    const { data, playMedia } = this.props
    const article = data.content[0]
    const { audio } = article

    if (!audio || !audio.url) {
      return null
    }

    const imgUrl = article.image && article.image.url

    return (
      <Card
        style={{ display: 'inline-block', width: '30vw' }}
        onPress={() => playMedia(audio.url, audio.audioTitle, audio.audioDescription, imgUrl)}
        title=''
        imageUrl={imgUrl}
        minorText=''
        factor={3}
        icon={<i className={`mdi mdi-headphones ${contentIcon}`} />}
      />
    )
  }

  renderMedia () {
    return (
      <div style={{ display: 'inline-block', float: 'left', marginRight: 10 }}>
        {this.renderVideo()}
        {this.renderAudio()}
      </div>
    )
  }

  renderArticle () {
    const { data } = this.props
    if (data.loading || data.error || !(data.content && data.content[0])) {
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
              <div key={index}>
                {index === 0 ? this.renderMedia() : null}
                {text}
              </div>
            ))
          }
          {this.renderUpdatedDate()}
        </div>
      </div>
    )
  }

  renderBottomNav () {
    const { history, toggleMediaPlayer } = this.props

    return (
      <MainBottomNav
        left={[
          <IconItem onClick={() => history.goBack()}>
            <i className='mdi mdi-chevron-left' />
          </IconItem>,
          <IconItem>
            <i className='mdi mdi-share' />
          </IconItem>,
        ]}
        right={[
          <IconItem>
            <i className='mdi mdi-star-outline' />
          </IconItem>,
          <IconItem>
            <i className='mdi mdi-download' />
          </IconItem>,
        ]}
      />
    )
  }

  render () {
    return (
      <div className={articleRoute}>
        { this.renderLoadingOrError() }
        { this.renderArticle() }
        { this.renderBottomNav() }
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch: Dispatch<any>): DispatchProps => {
  return {
    playMedia: (mediaUrl, mediaTitle, mediaDescription, imageUrl?) =>
      dispatch(playMedia({ mediaUrl, mediaTitle, mediaDescription, imageUrl })),
    toggleMediaPlayer: () => dispatch(toggleMediaDrawer({})),
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
)(ArticleRouteBase)
