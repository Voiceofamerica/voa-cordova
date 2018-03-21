
import * as React from 'react'
import { compose } from 'redux'
import { connect, Dispatch } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import Carousel from 'react-slick'

import { graphql, ChildProps, QueryOpts } from 'react-apollo'
import * as moment from 'moment'

import ResilientImage from '@voiceofamerica/voa-shared/components/ResilientImage'
import { IconItem } from '@voiceofamerica/voa-shared/components/BottomNav'
import SvgIcon from '@voiceofamerica/voa-shared/components/SvgIcon'
import Ticket from '@voiceofamerica/voa-shared/components/Ticket'

import { ArticleRouteQuery, ArticleRouteQueryVariables } from 'helpers/graphql-types'
import playMedia from 'redux-store/thunks/playMediaFromPsiphon'
import toggleFavoriteContent from 'redux-store/actions/toggleFavoriteContent'

import { mapImageUrl } from 'helpers/image'
import analytics, { AnalyticsProps } from 'helpers/analytics'
import { generatePDF } from 'helpers/articlePrinter'
import MainBottomNav from 'containers/MainBottomNav'
import ErrorBoundary from 'components/ErrorBoundary'
import Loader from 'components/Loader'
import { articleLabels } from 'labels'
import { audio as audioSvg, back, share, favorite, download, video as videoSvg } from '../../svg'

import AppState from 'types/AppState'

import {
  articleRoute,
  container,
  heading,
  articleText,
  paragraph,
  relatedArticles,
  relatedContentHeading,
  gallery,
  photoContent,
  photoContainer,
  photoText,
  photoTitle,
  photoItem,
  photoTextContainer,
  fadeOut,
  mediaButtonContainer,
  mediaButton,
  articleAuthors,
  articleDate,
  byline,
  icon,
  iconActive,
  heroImage,
  thumb,
  galleryDots,
} from './ArticleRoute.scss'
import * as Query from './ArticleRoute.graphql'

export interface Params {
  id: string
}

interface StateProps {
  isFavorite: boolean
  textSize: number
}

interface DispatchProps {
  playMedia: (url: string, title: string, description: string, isVideo: boolean, imageUrl?: string) => void
  toggleFavorite: (favorite?: boolean) => void
}

type BaseProps = RouteComponentProps<Params>
type QueryProps = ChildProps<BaseProps, ArticleRouteQuery>
type OwnProps = QueryProps
type Props = QueryProps & DispatchProps & StateProps & AnalyticsProps

class ArticleRouteBase extends React.Component<Props> {
  componentWillReceiveProps (newProps: Props) {
    if (newProps.match.params.id !== this.props.match.params.id) {
      const containerElement = this.refs.container as HTMLDivElement
      if (containerElement) {
        containerElement.scrollTop = 0
      }
    }
  }

  share = () => {
    if (!this.props.data.content || !this.props.data.content[0]) {
      return
    }
    const id = this.props.match.params.id
    const articleTitle = this.props.data.content[0].title
    const authors = this.props.data.content[0].authors.map(({ name: { first, last } }) => `${first} ${last}`).join('; ')

    this.props.analytics.shareArticle({
      id,
      articleTitle,
      authors,
    })

    const { url } = this.props.data.content[0]

    window.plugins.socialsharing.shareWithOptions({
      message: '',
      url,
    })
  }

  download = () => {
    if (!this.props.data.content || !this.props.data.content[0]) {
      return
    }
    const { title, authors, pubDate, content } = this.props.data.content[0]
    const authorNames = authors
      .map(auth => auth.name)
      .map(name => `${name.first} ${name.last}`)

    generatePDF({
      title,
      by: authorNames.join('; '),
      pubDate: moment(pubDate).format('lll'),
      content,
    }).catch(console.error)
  }

  toggleFavorite = () => {
    if (!this.props.data.content || !this.props.data.content[0]) {
      return
    }
    const id = this.props.match.params.id
    const articleTitle = this.props.data.content[0].title
    const authors = this.props.data.content[0].authors.map(({ name: { first, last } }) => `${first} ${last}`).join('; ')

    this.props.analytics.favoriteArticle({
      id,
      articleTitle,
      authors,
    })
    this.props.toggleFavorite()
  }

  renderBottomNav () {
    const { history, isFavorite } = this.props

    const favoriteIconClass = isFavorite ? `${icon} ${iconActive}` : icon

    return (
      <MainBottomNav
        left={[
          <IconItem key={0} onClick={() => history.goBack()}>
            <SvgIcon src={back} className={icon} />
          </IconItem>,
          <IconItem key={1} onClick={this.share}>
            <SvgIcon src={share} className={icon} />
          </IconItem>,
        ]}
        right={[
          <IconItem key={0} onClick={this.toggleFavorite}>
            <SvgIcon src={favorite} className={favoriteIconClass} />
          </IconItem>,
          <IconItem key={1} onClick={this.download}>
            <SvgIcon src={download} className={icon} />
          </IconItem>,
        ]}
      />
    )
  }

  renderImage () {
    const { image } = this.props.data.content[0]
    if (!image || !image.url) {
      return null
    }

    return <ResilientImage src={image.url} className={heroImage} />
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
        <div className={byline}>
          <div className={articleAuthors}>
          {
            authorNames.map((name, idx) => (
              <h2 key={idx}>{name}</h2>
            ))
          }
          </div>
          <div className={articleDate}>
            <h3>{moment(pubDate).format('lll')}</h3>
          </div>
        </div>
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
        {articleLabels.updatedOn(updated.format('lll'))}
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
      <IconItem
        className={mediaButton}
        onClick={() => playMedia(video.url, article.title, video.videoDescription, true, video.thumbnail)}
      >
        <SvgIcon src={videoSvg} />
      </IconItem>
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
      <IconItem
        className={mediaButton}
        onClick={() => playMedia(audio.url, audio.audioTitle, audio.audioDescription, false, imgUrl)}
      >
        <SvgIcon src={audioSvg} />
      </IconItem>
    )
  }

  renderMedia () {
    return (
      <div className={mediaButtonContainer}>
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
      <div className={container} ref='container'>
        {this.renderImage()}
        {this.renderHeading()}
        <div className={articleText}>
          {
            paragraphs.map((text, index) => (
              <div key={index} className={paragraph}>
                {index === 0 ? this.renderMedia() : null}
                {text}
              </div>
            ))
          }
          {this.renderUpdatedDate()}
        </div>
        {this.renderGallery()}
        <hr />
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

    return (
      <div>
        {
          article.photoGallery.map(gal => {
            const sorted = gal.photo.slice().sort((a, b) => a.order - b.order)
            const customPaging = (i) => (
              <a>
                <img src={sorted[sorted.length - i - 1].url} className={thumb} />
              </a>
            )

            return (
              <div key={gal.id} className={gallery} dir='ltr'>
                <Carousel dots dotsClass={galleryDots} customPaging={customPaging}>
                  {
                    sorted.map(photo => (
                      <div key={photo.id} className={photoContent}>
                        <div className={photoContainer}>
                          <ResilientImage src={photo.url} className={photoItem} contain />
                        </div>
                        <div className={photoTextContainer}>
                          <div className={photoText} dir='rtl'>
                            <div className={photoTitle}>
                              {photo.photoTitle}
                            </div>
                            {photo.photoDescription}
                          </div>
                          <div className={fadeOut} />
                        </div>
                      </div>
                    ))
                  }
                </Carousel>
              </div>
            )
          })
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
          {articleLabels.relatedContent}
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

  render () {
    const { textSize } = this.props

    return (
      <div className={articleRoute} style={{ fontSize: `${textSize}em` }}>
        <Loader data={this.props.data}>
          <ErrorBoundary>
            { this.renderArticle() }
          </ErrorBoundary>
        </Loader>
        { this.renderBottomNav() }
      </div>
    )
  }
}

const mapStateToProps = (state: AppState, ownProps: OwnProps): StateProps => {
  return {
    isFavorite: !!state.favorites[ownProps.match.params.id],
    textSize: state.settings.textSize,
  }
}

const mapDispatchToProps = (dispatch: Dispatch<any>, ownProps: OwnProps): DispatchProps => {
  return {
    playMedia: (mediaUrl, mediaTitle, mediaDescription, isVideo, imageUrl?) =>
      dispatch(playMedia({ mediaUrl, mediaTitle, mediaDescription, isVideo, imageUrl })),
    toggleFavorite: (favorite?: boolean) => {
      if (!ownProps.data || !ownProps.data.content || !ownProps.data.content[0]) {
        return
      }

      const { id, title, content, pubDate } = ownProps.data.content[0]
      dispatch(toggleFavoriteContent({ id, title, content, pubDate, favorite }))
    },
  }
}

const withAnalytics = analytics<Props>(({ data }) => ({
  state: data.content && data.content[0] && data.content[0].title,
  title: data.content && data.content[0] && data.content[0].title,
  skip: data.loading || !data.content || !data.content[0],
}))

const withQuery = graphql(
  Query,
  {
    options: (ownProps: OwnProps): QueryOpts<ArticleRouteQueryVariables> => ({
      variables: {
        id: parseInt(ownProps.match.params.id, 10),
      },
      fetchPolicy: 'cache-first',
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
            photoGallery: c.photoGallery && c.photoGallery.map(gallery => {
              return {
                ...gallery,
                photo: gallery.photo && gallery.photo.map(photo => {
                  return {
                    ...photo,
                    url: mapImageUrl(photo.url, 'w600'),
                  }
                }),
              }
            }),
          }
        })
      }

      return { data: outputData }
    },
  },
)

const withRedux = connect(mapStateToProps, mapDispatchToProps)

export default compose(
  withQuery,
  withRedux,
  withAnalytics,
)(ArticleRouteBase)
