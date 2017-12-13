
import * as React from 'react'
import { Route, Switch } from 'react-router'
import { ConnectedRouter } from 'react-router-redux'

import HomeRoute from 'routes/HomeRoute'
import CategoryRoute from 'routes/CategoryRoute'
import ArticleRoute from 'routes/ArticleRoute'
import Settings from 'routes/Settings'
import LiveStream from 'routes/LiveStream'
import CategorySettings from 'routes/CategorySettings'
import MediaSettings from 'routes/MediaSettings'
import Search from 'routes/Search'

import MainLayout from './layouts/MainLayout'

import history from './history'

export default () => (
  <ConnectedRouter history={history}>
    <Switch>
      <Route path='/article/:id' component={ArticleRoute}/>
      <Route path='/settings/categories' component={CategorySettings}/>
      <Route path='/settings/media' component={MediaSettings}/>
      <Route path='/settings' component={Settings}/>
      <Route path='/search/:zoneId/:query' component={Search}/>
      <Route path='/search/:zoneId' component={Search}/>
      <Route path='/search' component={Search}/>
      <MainLayout path='/liveStream' component={LiveStream}/>
      <MainLayout path='/articles/:category' component={CategoryRoute}/>
      <MainLayout path='/' component={HomeRoute}/>
    </Switch>
  </ConnectedRouter>
)
