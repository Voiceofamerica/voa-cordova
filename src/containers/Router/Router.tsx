
import * as React from 'react'
import { Route, Switch } from 'react-router'
import { ConnectedRouter } from 'react-router-redux'

import HomeRoute from 'routes/HomeRoute'
import ArticleRoute from 'routes/ArticleRoute'
import Settings from 'routes/Settings'
import CategorySettings from 'routes/CategorySettings'
import MediaSettings from 'routes/MediaSettings'

import MainLayout from './layouts/MainLayout'

import history from './history'

export default () => (
  <ConnectedRouter history={history}>
    <Switch>
      <Route path='/article/:id' component={ArticleRoute}/>
      <Route path='/settings/categories' component={CategorySettings}/>
      <Route path='/settings/media' component={MediaSettings}/>
      <Route path='/settings' component={Settings}/>
      <MainLayout path='/' component={HomeRoute}/>
    </Switch>
  </ConnectedRouter>
)
