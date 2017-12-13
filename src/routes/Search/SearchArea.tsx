
import * as React from 'react'
import * as moment from 'moment'
import { RouteComponentProps } from 'react-router'
import { graphql, ChildProps } from 'react-apollo'

import Ticket from '@voiceofamerica/voa-shared/components/Ticket'
import BottomNav, { IconItem } from '@voiceofamerica/voa-shared/components/BottomNav'

import { SearchQuery, SearchQueryVariables } from 'helpers/graphql-types'
import * as Query from './Search.graphql'

import { searchArea, row, ticketIcon, inputs, searchInput } from './Search.scss'

interface OwnProps extends SearchQueryVariables {
  goTo: (route: string) => void
}

type Props = ChildProps<OwnProps, SearchQuery>

class SearchAreaBase extends React.Component<Props> {
  goToArticle (id: number) {
    this.props.goTo(`/article/${id}`)
  }

  renderLoading () {
    const { data } = this.props
    if (!data.loading) {
      return null
    }

    return (
      <div style={{ display: 'flex', flex: 1, justifyContent: 'center', height: '100%', zIndex: 1 }}>
        <div style={{ alignContent: 'center', fontSize: '10vw', backgroundColor: 'transparent', textAlign: 'center' }}>
          装载...
        </div>
      </div>
    )
  }

  renderEmpty () {
    return (
      <div style={{ display: 'flex', flex: 1, justifyContent: 'center', height: '100%', zIndex: 1 }}>
        <div style={{ alignContent: 'center', fontSize: '10vw', backgroundColor: 'transparent', textAlign: 'center' }}>
          没有
        </div>
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
    const { search = [], loading } = this.props.data
    const filteredSearch = search.filter(b => b)

    if (loading) {
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
        {this.renderLoading()}
        {this.renderContent()}
      </div>
    )
  }
}

const pathRgx = /\/(.{36})((?:_tv)?)[^\.]*\.(.*)/
const mapImageUrl = (url: string, params: string = 'w100') => {
  const parsedUrl = new URL(url)
  const pathParts = pathRgx.exec(parsedUrl.pathname)
  const guid = pathParts[1]
  const tv = pathParts[2]
  const ext = pathParts[3]
  console.log(parsedUrl.pathname)
  parsedUrl.pathname = `${guid}${tv}_${params}.${ext}`
  return parsedUrl.toString()
}

const withSearchQuery = graphql(
  Query,
  {
    options: (props: OwnProps) => ({
      variables: props,
    }),
    props: ({ data }) => {
      let outputData = data as (typeof data) & SearchQuery
      const { search = [] } = outputData
      if (!data.loading) {
        outputData.search = search.filter(c => c).map(c => {
          return {
            ...c,
            image: c.image && {
              ...c.image,
              url: mapImageUrl(c.image.url),
            },
          }
        })
      }

      return { data: outputData }
    },
  },
)

export default withSearchQuery(SearchAreaBase)
