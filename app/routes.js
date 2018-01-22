/* eslint flowtype-errors/show-errors: 0 */
import React from 'react'
import { Switch, Route } from 'react-router'
import App from './routes/app'
import Activity from './routes/activity'
import Contacts from './routes/contacts'
import Network from './routes/network'
import Help from './routes/help'

const routes = () => (
  <App>
    <Switch>
      <Route path='/contacts' component={Contacts} />
      <Route path='/network' component={Network} />
      <Route path='/help' component={Help} />
      <Route path='/' component={Activity} />
    </Switch>
  </App>
)

export default routes
