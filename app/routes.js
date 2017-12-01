/* eslint flowtype-errors/show-errors: 0 */
import React from 'react'
import { Switch, Route } from 'react-router'
import App from './routes/app'
import Activity from './routes/activity'
import Peers from './routes/peers'
import Channels from './routes/channels'

export default () => (
  <App>
    <Switch>
      <Route path='/peers' component={Peers} />
      <Route path='/channels' component={Channels} />
      <Route path='/' component={Activity} />
    </Switch>
  </App>
)
