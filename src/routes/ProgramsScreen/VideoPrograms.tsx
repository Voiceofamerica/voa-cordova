
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

// import { programsScreenLabels } from 'labels'
import { ProgramVideosQuery, ProgramVideosQueryVariables } from 'helpers/graphql-types'
import { mapImageUrl } from 'helpers/image'

import Params from './Params'
import * as Query from './Videos.graphql'
import { programContent } from './ProgramsScreen.scss'

interface OwnProps {
  history: History
  match: match<Params>
}

interface DispatchProps {
  playMedia: (mediaUrl: string, mediaTitle: string, mediaDescription: string, isVideo: boolean) => void
}

type Props = ChildProps<OwnProps, ProgramVideosQuery> & DispatchProps

class ClipPrograms extends React.Component<Props> {
  goTo (route: string) {
    const { history } = this.props
    history.push(route)
  }

  playVideo (item: ProgramVideosQuery['program'][0]) {
    this.props.playMedia(
      item.url,
      item.programTitle,
      item.programDescription,
      true,
    )
  }

  render () {
    const { data } = this.props

    return (
      <div className={programContent}>
        <Loader data={data}>
          {
            data.program && data.program.map(item => (
              <div key={item.id}>
                <Ticket
                  onPress={() => this.playVideo(item)}
                  title={item.programTitle}
                  imageUrl={item.image && item.image.url}
                  minorText={moment(item.date).format('lll')}
                />
              </div>
            ))
          }
        </Loader>
      </div>
    )
  }
}

const withQuery = graphql<ProgramVideosQuery, OwnProps>(
  Query,
  {
    props: ({ data }) => {
      if (!data.loading && !data.error) {
        data.program = data.program.filter(c => c && c.url).map(c => {
          return {
            ...c,
            image: c.image && {
              ...c.image,
              url: mapImageUrl(c.image.url, 'w100'),
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
      fetchPolicy: 'cache-first',
    }),
  },
)

const mapDispatchToProps = (dispatch: Dispatch<any>): DispatchProps => {
  return {
    playMedia: (mediaUrl, mediaTitle, mediaDescription, isVideo) =>
      dispatch(playMedia({ mediaUrl, mediaTitle, mediaDescription, isVideo })),
  }
}

const withRedux = connect(null, mapDispatchToProps)

export default compose(
  withQuery,
  withRedux,
)(ClipPrograms)
