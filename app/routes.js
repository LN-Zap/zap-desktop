/* eslint flowtype-errors/show-errors: 0 */
import React from 'react'
import { Switch, Route } from 'react-router'
import App from './routes/app'
import Activity from './routes/activity'
import Contacts from './routes/contacts'
import Peers from './routes/peers'
import Channels from './routes/channels'
import Network from './routes/network'

export default () => (
  <App>
    <Switch>
      <Route path='/peers' component={Peers} />
      <Route path='/channels' component={Channels} />
      <Route path='/contacts' component={Contacts} />
      <Route path='/network' component={Network} />
      <Route path='/' component={Activity} />
    </Switch>
  </App>
)
