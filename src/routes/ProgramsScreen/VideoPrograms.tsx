
import * as React from 'react'
import { compose } from 'redux'
import { History } from 'history'
import * as moment from 'moment'
import { match } from 'react-router'
import { graphql, ChildProps, QueryOpts } from 'react-apollo'
import { connect, Dispatch } from 'react-redux'
import { List, ListRowProps } from 'react-virtualized'

import Ticket from '@voiceofamerica/voa-shared/components/Ticket'

import Loader from 'components/Loader'
import playMedia from 'redux-store/thunks/playMediaFromPsiphon'

// import { programsScreenLabels } from 'labels'
import { ProgramVideosQuery, ProgramVideosQueryVariables } from 'helpers/graphql-types'
import { mapImageUrl } from 'helpers/image'
import { programsScreenLabels } from 'labels'

import Params from './Params'
import * as Query from './Videos.graphql'
import { programContent, emptyContent } from './ProgramsScreen.scss'

interface OwnProps {
  history: History
  match: match<Params>
}

interface DispatchProps {
  playMedia: (mediaUrl: string, mediaTitle: string, mediaDescription: string, imageUrl: string) => void
}

type QueryProps = ChildProps<OwnProps, ProgramVideosQuery>
type Props = QueryProps & DispatchProps

class VideoPrograms extends React.Component<Props> {

  playVideo (item: ProgramVideosQuery['content'][0]['video'], imageUrl) {
    this.props.playMedia(
      item.url,
      item.videoTitle,
      item.videoDescription,
      imageUrl,
    )
  }

  renderVirtualContent () {
    const { data: { content } } = this.props
    const rowHeight = 105

    return (
      <List
        height={window.innerHeight - 150}
        rowHeight={rowHeight}
        rowCount={content.length}
        width={window.innerWidth}
        rowRenderer={this.renderRow}
      />
    )
  }

  renderRow = ({ index, isScrolling, key, style }: ListRowProps) => {
    const { data: { content } } = this.props

    const { image, video, pubDate } = content[index]

    return (
      <div key={key} style={style}>
        <Ticket
          onPress={() => this.playVideo(video, image && image.url)}
          title={video.videoTitle}
          imageUrl={image && image.url}
          minorText={moment(pubDate).format('lll')}
          suppressImage={isScrolling}
        />
      </div>
    )
  }

  renderEmpty () {
    return (
      <div className={emptyContent}>
        {programsScreenLabels.empty}
      </div>
    )
  }

  render () {
    const { data } = this.props

    const content = data.content && data.content.length ? this.renderVirtualContent() : this.renderEmpty()

    return (
      <div className={programContent}>
        <Loader data={data}>
          {content}
        </Loader>
      </div>
    )
  }
}

const withQuery = graphql<QueryProps, ProgramVideosQuery>(
  Query,
  {
    props: ({ data }) => {
      if (!data.loading && !data.error) {
        data.content = data.content.filter(c => c && c.video && c.video.url).map(c => {
          return {
            ...c,
            image: c.image && {
              ...c.image,
              url: mapImageUrl(c.image.url, 'w300'),
            },
          }
        })
      }

      return { data }
    },
    options: (ownProps: OwnProps): QueryOpts<ProgramVideosQueryVariables> => ({
      variables: {
        zone: parseInt(ownProps.match.params.zone || '0', 10),
      },
    }),
  },
)

const mapDispatchToProps = (dispatch: Dispatch<any>): DispatchProps => {
  return {
    playMedia: (mediaUrl, mediaTitle, mediaDescription, imageUrl) =>
      dispatch(playMedia({ mediaUrl, mediaTitle, mediaDescription, isVideo: true, imageUrl })),
  }
}

const withRedux = connect(null, mapDispatchToProps)

export default compose(
  withQuery,
  withRedux,
)(VideoPrograms)
