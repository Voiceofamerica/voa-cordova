
import * as React from 'react'
import { compose } from 'redux'
import { History } from 'history'
import * as moment from 'moment'
import { match } from 'react-router'
import { graphql, ChildProps, QueryOpts } from 'react-apollo'
import { connect, Dispatch } from 'react-redux'

import Ticket from '@voiceofamerica/voa-shared/components/Ticket'

import Loader from 'components/Loader'
import playMedia from 'redux-store/thunks/playMediaFromPsiphon'

import { ProgramAudioQuery, ProgramAudioQueryVariables } from 'helpers/graphql-types'
import { mapImageUrl } from 'helpers/image'

import Params from './Params'
import * as Query from './Audio.graphql'
import { programContent } from './ProgramsScreen.scss'

interface OwnProps {
  history: History
  match: match<Params>
}

interface DispatchProps {
  playMedia: (mediaUrl: string, mediaTitle: string, mediaDescription: string, imageUrl: string) => void
}

type QueryProps = ChildProps<OwnProps, ProgramAudioQuery>
type Props = QueryProps & DispatchProps

class AudioPrograms extends React.Component<Props> {
  playAudio (item: ProgramAudioQuery['content'][0]['audio'], imageUrl: string) {
    this.props.playMedia(
      item.url,
      item.audioTitle,
      item.audioDescription,
      imageUrl,
    )
  }

  render () {
    const { data } = this.props

    return (
      <div className={programContent}>
        <Loader data={data}>
          {
            data.content && data.content.map(({ id, audio, image, pubDate }) => (
              <div key={id}>
                <Ticket
                  onPress={() => this.playAudio(audio, image && image.url)}
                  title={audio.audioTitle}
                  imageUrl={image && image.url}
                  minorText={moment(pubDate).format('lll')}
                />
              </div>
            ))
          }
        </Loader>
      </div>
    )
  }
}

const withQuery = graphql<QueryProps, ProgramAudioQuery>(
  Query,
  {
    props: ({ data }) => {
      if (!data.loading && !data.error) {
        data.content = data.content.filter(c => c && c.audio && c.audio.url).map(c => {
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
    options: (ownProps: OwnProps): QueryOpts<ProgramAudioQueryVariables> => ({
      variables: {
        zone: parseInt(ownProps.match.params.zone || '0', 10),
      },
    }),
  },
)

const mapDispatchToProps = (dispatch: Dispatch<any>): DispatchProps => {
  return {
    playMedia: (mediaUrl, mediaTitle, mediaDescription, imageUrl) =>
      dispatch(playMedia({ mediaUrl, mediaTitle, mediaDescription, isVideo: false, imageUrl })),
  }
}

const withRedux = connect(null, mapDispatchToProps)

export default compose(
  withQuery,
  withRedux,
)(AudioPrograms)
