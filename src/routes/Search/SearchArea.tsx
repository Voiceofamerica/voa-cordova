
import * as React from 'react'
import * as moment from 'moment'
import { graphql, ChildProps } from 'react-apollo'

import Ticket from '@voiceofamerica/voa-shared/components/Ticket'
import SvgIcon from '@voiceofamerica/voa-shared/components/SvgIcon'

import Loader from 'components/Loader'

import { SearchQuery, SearchQueryVariables } from 'helpers/graphql-types'

import { searchLabels } from 'labels'

import * as Query from './Search.graphql'

import { searchArea, row, loadingText, loader, iconCircle } from './Search.scss'

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
        {searchLabels.empty}
      </div>
    )
  }

  renderIcon = (blurb: SearchQuery['search'][0]) => {
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

  renderIconWithCircle = (blurb: SearchQuery['search'][0]) => {
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
          imageUrl={blurb.image && blurb.image.tiny}
          icon={this.renderIcon(blurb)}
        />
      </div>
    ))
  }

  render () {
    return (
      <div className={searchArea}>
        <Loader className={loader} data={this.props.data}>
          {this.renderContent()}
        </Loader>
      </div>
    )
  }
}

const withSearchQuery = graphql<Props, SearchQuery>(
  Query,
  {
    options: (props: OwnProps) => ({
      variables: props,
      fetchPolicy: 'cache-and-network',
    }),
  },
)

export default withSearchQuery(SearchAreaBase)
