
import * as React from 'react'
import { History } from 'history'
import { graphql, ChildProps } from 'react-apollo'
import * as moment from 'moment'

import TopNav, { TopNavItem, StaticItem } from '@voiceofamerica/voa-shared/components/TopNav'
import Ticket from '@voiceofamerica/voa-shared/components/Ticket'

import Loader from 'components/Loader'

// import { programsScreenLabels } from 'labels'
import { ProgramGalleriesQuery } from 'helpers/graphql-types'
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
          <StaticItem />
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
                  imageUrl={item.image && item.image.tiny}
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

const withQuery = graphql<Props, ProgramGalleriesQuery>(
  Query,
)

export default withQuery(GalleryPrograms)
