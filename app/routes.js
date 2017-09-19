/* eslint flowtype-errors/show-errors: 0 */
import React from 'react'
import { Switch, Route } from 'react-router'
import App from './routes/app'
import Activity from './routes/activity'
import Wallet from './routes/wallet'
import Node from './routes/node'

export default () => (
  <App>
    <Switch>
      <Route path='/wallet' component={Wallet} />
      <Route path='/node' component={Node} />
      <Route path='/' component={Activity} />
    </Switch>
  </App>
);
