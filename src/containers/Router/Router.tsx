
import * as React from 'react'
import { Route, Switch } from 'react-router'
import { ConnectedRouter } from 'react-router-redux'

import HomeRoute from 'routes/HomeRoute'
import CategoryRoute from 'routes/CategoryRoute'
import ArticleRoute from 'routes/ArticleRoute'
import Settings from 'routes/Settings'
import LiveStream from 'routes/LiveStream'
import BreakingNews from 'routes/BreakingNews'
import CategorySettings from 'routes/CategorySettings'
import MediaSettings from 'routes/MediaSettings'
import Search from 'routes/Search'
import FavoritesSettings from 'routes/FavoritesSettings'
import NotificationSettings from 'routes/NotificationSettings'
import TextSettings from 'routes/TextSettings'

import {
  searchLabels,
  settingsLabels,
  liveStreamLabels,
  breakingNewsLabels,
  favoritesSettingsLabels,
  notificationSettingsLabels,
  textSettingsLabels,
} from 'labels'

import HeadingLayout from './layouts/HeadingLayout'
import HeadingOnlyLayout from './layouts/HeadingOnlyLayout'
import MainLayout from './layouts/MainLayout'

import history from './history'

export default () => (
  <ConnectedRouter history={history}>
    <Switch>
      <Route path='/article/:id' component={ArticleRoute}/>
      <Route path='/settings/categories' component={CategorySettings}/>
      <Route path='/settings/media' component={MediaSettings}/>
      <HeadingOnlyLayout path='/search/:zoneId/:query' component={Search} heading={searchLabels.header}/>
      <HeadingOnlyLayout path='/search/:zoneId' component={Search} heading={searchLabels.header}/>
      <HeadingOnlyLayout path='/search' component={Search} heading={searchLabels.header}/>
      <HeadingOnlyLayout path='/settings/favorites' component={FavoritesSettings} heading={favoritesSettingsLabels.header} />
      <HeadingOnlyLayout path='/settings/notifications' component={NotificationSettings} heading={notificationSettingsLabels.header} />
      <HeadingOnlyLayout path='/settings/text' component={TextSettings} heading={textSettingsLabels.header} />
      <HeadingLayout path='/settings' component={Settings} heading={settingsLabels.header} />
      <HeadingLayout path='/liveStream' component={LiveStream} heading={liveStreamLabels.header} />
      <HeadingLayout path='/breakingNews' component={BreakingNews} heading={breakingNewsLabels.header} />
      <MainLayout path='/articles/:category' component={CategoryRoute}/>
      <MainLayout path='/' component={HomeRoute}/>
    </Switch>
  </ConnectedRouter>
)
