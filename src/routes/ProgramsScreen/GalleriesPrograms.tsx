
import * as React from 'react'
import { History } from 'history'
import { graphql, ChildProps } from 'react-apollo'
import * as moment from 'moment'

import TopNav, { TopNavItem } from '@voiceofamerica/voa-shared/components/TopNav'
import Ticket from '@voiceofamerica/voa-shared/components/Ticket'

import Loader from 'components/Loader'

// import { programsScreenLabels } from 'labels'
import { ProgramGalleriesQuery } from 'helpers/graphql-types'
import { mapImageUrl } from 'helpers/image'
import * as Query from './Galleries.graphql'

import { programContent } from './ProgramsScreen.scss'

interface OwnProps {
  history: History
}

type Props = ChildProps<OwnProps, ProgramGalleriesQuery>

class GalleryPrograms extends React.Component<Props> {
  goTo (route: string) {
    const { history } = this.props
    history.push(route)
  }

  goToArticle (id: number) {
    this.goTo(`/article/${id}`)
  }
  render () {
    const { data } = this.props

    return (
      <div className={programContent}>
        <TopNav>
          <TopNavItem selected>
            Test
          </TopNavItem>
          <TopNavItem>
            Test 1
          </TopNavItem>
          <TopNavItem>
            +
          </TopNavItem>
        </TopNav>
        <Loader data={data}>
          {
            data.content && data.content.map(item => (
              <div key={item.id}>
                <Ticket
                  onPress={() => this.goToArticle(item.id)}
                  title={item.title}
                  imageUrl={item.image && item.image.url}
                  minorText={moment(item.pubDate).format('lll')}
                />
              </div>
            ))
          }
        </Loader>
      </div>
    )
  }
}

const withQuery = graphql<ProgramGalleriesQuery, OwnProps>(
  Query,
  {
    props: ({ data }) => {
      if (!data.loading && !data.error) {
        data.content = data.content.filter(c => c).map(c => {
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
    options: {
      fetchPolicy: 'cache-first',
    },
  },
)

export default withQuery(GalleryPrograms)
