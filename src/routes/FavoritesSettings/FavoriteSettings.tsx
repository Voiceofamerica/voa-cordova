
import * as React from 'react'
import { RouteComponentProps } from 'react-router'
import { connect } from 'react-redux'
import { compose } from 'redux'
import * as moment from 'moment'

import Ticket from '@voiceofamerica/voa-shared/components/Ticket'
import BottomNav, { IconItem } from '@voiceofamerica/voa-shared/components/BottomNav'

import analytics, { AnalyticsProps } from 'helpers/analytics'
import AppState from 'types/AppState'
import FavoriteContent from 'types/FavoriteContent'

import { favoriteSettings } from './FavoriteSettings.scss'

interface StateProps {
  favorites: FavoriteContent[]
}

interface DispatchProps {
}

type RouteProps = RouteComponentProps<void>

type Props = RouteProps & AnalyticsProps & StateProps & DispatchProps

class FavoriteSettingsRoute extends React.Component<Props> {
  goToArticle = (id: number) => {
    this.props.history.push(`/article/${id}`)
  }

  render () {
    const { history, favorites } = this.props

    return (
      <div className={favoriteSettings}>
        {
          favorites.map(({ id, title, content, pubDate }) => (
            <Ticket
              title={title}
              description={content}
              minorText={moment(pubDate).fromNow()}
              onPress={() => this.goToArticle(id)}
            />
          ))
        }
        <BottomNav>
          <IconItem onClick={() => history.goBack()}>
            <i className={`mdi mdi-arrow-left`} />
          </IconItem>
        </BottomNav>
      </div>
    )
  }
}

const mapStateToProps = (state: AppState): StateProps => ({
  favorites: Object.values(state.favorites),
})

const withRedux = connect(mapStateToProps)

const withAnalytics = analytics<Props>({
  state: 'Settings',
  title: 'Settings',
})

export default compose(
  withRedux,
  withAnalytics,
)(FavoriteSettingsRoute)
