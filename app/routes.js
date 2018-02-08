/* eslint flowtype-errors/show-errors: 0 */
import React from 'react'
import { Switch, Route } from 'react-router'
import App from './routes/app'
import Activity from './routes/activity'

const routes = () => (
  <App>
    <Switch>
      <Route path='/' component={Activity} />
    </Switch>
  </App>
)

export default routes
