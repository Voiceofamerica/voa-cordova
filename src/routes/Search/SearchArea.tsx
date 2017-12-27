
import * as React from 'react'
import * as moment from 'moment'
import { RouteComponentProps } from 'react-router'
import { graphql, ChildProps } from 'react-apollo'

import Ticket from '@voiceofamerica/voa-shared/components/Ticket'
import BottomNav, { IconItem } from '@voiceofamerica/voa-shared/components/BottomNav'

import Loader from 'components/Loader'

import { SearchQuery, SearchQueryVariables } from 'helpers/graphql-types'
import { mapImageUrl } from 'helpers/image'

import * as Query from './Search.graphql'

import { searchArea, row, ticketIcon, inputs, searchInput, loadingText, loader } from './Search.scss'

interface OwnProps extends SearchQueryVariables {
  goTo: (route: string) => void
}

type Props = ChildProps<OwnProps, SearchQuery>

class SearchAreaBase extends React.Component<Props> {
  goToArticle (id: number) {
    this.props.goTo(`/article/${id}`)
  }

  renderEmpty () {
    return (
      <div className={loadingText}>
        没有
      </div>
    )
  }

  renderIcon = (blurb) => {
    if (blurb.video && blurb.video.url) {
      return <i className={`mdi mdi-monitor ${ticketIcon}`} />
    } else if (blurb.audio && blurb.audio.url) {
      return <i className={`mdi mdi-headphones ${ticketIcon}`} />
    } else {
      return null
    }
  }

  renderContent () {
    const { search = [], loading, error } = this.props.data
    const filteredSearch = search.filter(b => b)

    if (loading || error) {
      return null
    }

    if (filteredSearch.length === 0) {
      return this.renderEmpty()
    }

    return filteredSearch.map(blurb => (
      <div className={row} key={blurb.id}>
        <Ticket
          onPress={() => this.goToArticle(blurb.id)}
          title={blurb.title}
          minorText={moment(blurb.pubDate).fromNow()}
          imageUrl={blurb.image && blurb.image.url}
          icon={this.renderIcon(blurb)}
        />
      </div>
    ))
  }

  render () {
    const { search = [], loading } = this.props.data

    const filteredSearch = search.filter(b => b)

    return (
      <div className={searchArea}>
        <Loader className={loader} data={this.props.data}>
          {this.renderContent()}
        </Loader>
      </div>
    )
  }
}

const withSearchQuery = graphql(
  Query,
  {
    options: (props: OwnProps) => ({
      variables: props,
      fetchPolicy: 'network-only',
    }),
    props: ({ data }) => {
      let outputData = data as (typeof data) & SearchQuery
      const { search = [] } = outputData
      if (!data.loading && !data.error && search) {
        outputData.search = search.filter(c => c).map(c => {
          return {
            ...c,
            image: c.image && {
              ...c.image,
              url: mapImageUrl(c.image.url, 'w100'),
            },
          }
        })
      }

      return { data: outputData }
    },
  },
)

export default withSearchQuery(SearchAreaBase)
