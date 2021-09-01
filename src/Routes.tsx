import React from 'react'
import { BrowserRouter, Route, Switch} from 'react-router-dom'

import Form from './pages/Form'
import Chat from './pages/Chat'

const Routes: React.FC = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/" exact component={Form} />
      <Route path="/chat" component={Chat} />
    </Switch>
  </BrowserRouter>
)

export default Routes
