
import * as React from 'react'
import { RouteComponentProps } from 'react-router'
import { connect, Dispatch } from 'react-redux'
import { compose } from 'redux'
import * as moment from 'moment'

import Ticket from '@voiceofamerica/voa-shared/components/Ticket'
import SwipeToDelete from '@voiceofamerica/voa-shared/components/SwipeToDelete'
import BottomNav, { IconItem } from '@voiceofamerica/voa-shared/components/BottomNav'

import analytics, { AnalyticsProps } from 'helpers/analytics'
import AppState from 'types/AppState'
import FavoriteContent from 'types/FavoriteContent'
import toggleFavoriteContent from 'redux-store/actions/toggleFavoriteContent'
import clearFavorites from 'redux-store/actions/clearFavorites'

import { favoritesSettingsLabels } from 'labels'

import { favoriteSettings, removeAllContainer, removeAllButton } from './FavoriteSettings.scss'

interface StateProps {
  favorites: FavoriteContent[]
}

interface DispatchProps {
  unfavorite: (id: number) => void
  clearAllFavorites: () => void
}

type RouteProps = RouteComponentProps<void>

type Props = RouteProps & AnalyticsProps & StateProps & DispatchProps

class FavoriteSettingsRoute extends React.Component<Props> {
  goToArticle = (id: number) => {
    this.props.history.push(`/article/${id}`)
  }

  render () {
    const { history, favorites, unfavorite, clearAllFavorites } = this.props

    return (
      <div className={favoriteSettings}>
        <div className={removeAllContainer}>
          <div className={removeAllButton} onClick={clearAllFavorites}>
            {favoritesSettingsLabels.removeAll}
          </div>
        </div>
        {
          favorites.map(({ id, title, content, pubDate }) => (
            <SwipeToDelete onSwipe={() => unfavorite(id)} key={id}>
              <Ticket
                title={title}
                description={content}
                minorText={moment(pubDate).fromNow()}
                onPress={() => this.goToArticle(id)}
              />
            </SwipeToDelete>
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

const mapDispatchToProps = (dispatch: Dispatch<AppState>): DispatchProps => ({
  unfavorite: (id) => dispatch(toggleFavoriteContent({
    id,
    title: '',
    content: '',
    pubDate: '',
    favorite: false,
  })),
  clearAllFavorites: () => dispatch(clearFavorites()),
})

const withRedux = connect(mapStateToProps, mapDispatchToProps)

const withAnalytics = analytics<Props>({
  state: 'Settings',
  title: 'Settings',
})

export default compose(
  withRedux,
  withAnalytics,
)(FavoriteSettingsRoute)
