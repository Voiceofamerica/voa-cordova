
import * as React from 'react'
import { compose } from 'redux'
import { connect, Dispatch } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import Carousel from 'react-slick'

import { graphql, ChildProps, QueryOpts } from 'react-apollo'
import * as moment from 'moment'

import ResilientImage from '@voiceofamerica/voa-shared/components/ResilientImage'
import BottomNav, { IconItem, RoundItem } from '@voiceofamerica/voa-shared/components/BottomNav'
import Card from '@voiceofamerica/voa-shared/components/Card'
import Ticket from '@voiceofamerica/voa-shared/components/Ticket'

import { ArticleRouteQuery, ArticleRouteQueryVariables } from 'helpers/graphql-types'
import playMedia from 'redux-store/thunks/playMediaFromBlob'
import toggleMediaDrawer from 'redux-store/actions/toggleMediaDrawer'

import { mapImageUrl } from 'helpers/image'
import MainBottomNav from 'containers/MainBottomNav'
import Loader from 'components/Loader'

import {
  articleRoute,
  container,
  heading,
  articleText,
  contentIcon,
  centerIcon,
  iconText,
  relatedArticles,
  relatedContentHeading,
  gallery,
  photoContent,
  photoContainer,
  photoText,
  photoTitle,
  photoItem
} from './ArticleRoute.scss'
import * as Query from './ArticleRoute.graphql'

export interface Params {
  id: string
}

interface DispatchProps {
  playMedia: (url: string, title: string, description: string, isVideo: boolean, imageUrl?: string) => void
  toggleMediaPlayer: () => void
}

type OwnProps = RouteComponentProps<Params>
type QueryProps = ChildProps<OwnProps, ArticleRouteQuery>
type Props = QueryProps & DispatchProps

class ArticleRouteBase extends React.Component<Props> {
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
        style={{ display: 'inline-block', width: '30vw', marginRight: '1.5vw' }}
        onPress={() => playMedia(video.url, article.title, video.videoDescription, true, video.thumbnail)}
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
        onPress={() => playMedia(audio.url, audio.audioTitle, audio.audioDescription, false, imgUrl)}
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
        {this.renderGallery()}
        {this.renderRelatedArticles()}
      </div>
    )
  }

  renderGallery () {
    const { data } = this.props
    const article = data.content[0]

    if (!article.photoGallery || article.photoGallery.length === 0) {
      return null
    }

    const settings = {
      dots: true,
      slidesToShow: 1,
      slidesToScroll: 1,
    }

    // gallery,
    // photoContent,
    // photoContainer,
    // photoText,
    // photoTitle,

    return (
      <div>
        {
          article.photoGallery.map(gal => (
            <div className={gallery}>
              <Carousel dots>
                {
                  gal.photo.sort((a, b) => a.order - b.order).map(photo => (
                    <div className={photoContent}>
                      <div className={photoContainer}>
                        <ResilientImage src={photo.url} className={photoItem} />
                      </div>
                      <div className={photoText}>
                        <div className={photoTitle}>
                          {photo.photoTitle}
                        </div>
                        {photo.photoDescription}
                      </div>
                    </div>
                  ))
                }
              </Carousel>
            </div>
          ))
        }
      </div>
    )
  }

  renderRelatedArticles () {
    const { data, history } = this.props
    if (data.loading || data.error || !(data.content && data.content[0])) {
      return null
    }

    const article = data.content[0]
    if (article.relatedStories.length === 0) {
      return null
    }

    return (
      <div className={relatedArticles}>
        <span className={relatedContentHeading}>
          相关内容
        </span>
        {
          article.relatedStories.map(related => (
            <div key={related.id}>
              <Ticket
                onPress={() => history.push(`/article/${related.id}`)}
                title={related.storyTitle}
                imageUrl={related.thumbnailUrl}
                minorText={moment(related.pubDate).fromNow()}
              />
            </div>
          ))
        }
      </div>
    )
  }

  renderBottomNav () {
    const { history, toggleMediaPlayer } = this.props

    return (
      <MainBottomNav
        left={[
          <IconItem key={0} onClick={() => history.goBack()}>
            <i className='mdi mdi-chevron-left' />
          </IconItem>,
          <IconItem key={1}>
            <i className='mdi mdi-share' />
          </IconItem>,
        ]}
        right={[
          <IconItem key={0}>
            <i className='mdi mdi-star-outline' />
          </IconItem>,
          <IconItem key={1}>
            <i className='mdi mdi-download' />
          </IconItem>,
        ]}
      />
    )
  }

  render () {
    return (
      <div className={articleRoute}>
        <Loader data={this.props.data}>
          { this.renderArticle() }
        </Loader>
        { this.renderBottomNav() }
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch: Dispatch<any>): DispatchProps => {
  return {
    playMedia: (mediaUrl, mediaTitle, mediaDescription, isVideo, imageUrl?) =>
      dispatch(playMedia({ mediaUrl, mediaTitle, mediaDescription, isVideo, imageUrl })),
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

    props: ({ data }) => {
      let outputData = data as (typeof data) & ArticleRouteQuery
      if (!data.loading && !data.error) {
        outputData.content = outputData.content.filter(c => c).map(c => {
          return {
            ...c,
            image: c.image && {
              ...c.image,
              url: mapImageUrl(c.image.url, 'w600'),
            },
          }
        })
      }

      return { data: outputData }
    },
  },
)

const withRedux = connect(null, mapDispatchToProps)

export default compose(
  withQuery,
  withRedux,
)(ArticleRouteBase)
