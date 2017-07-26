/* eslint flowtype-errors/show-errors: 0 */
import React from 'react'
import { Switch, Route } from 'react-router'
import App from './routes/app'
import Home from './routes/home'

export default () => (
  <App>
    <Switch>
      <Route path='/' component={Home} />
    </Switch>
  </App>
);
