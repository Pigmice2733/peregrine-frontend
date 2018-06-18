import { h, render } from 'preact'
import { Router } from 'preact-router'
import AsyncRoute from 'preact-async-route'

const def = <T extends any>(m: T) => m.default

export const App = () => (
  <Router>
    <AsyncRoute
      path="/"
      getComponent={() => import('./routes/home').then(def)}
    />
    <AsyncRoute
      path="/event/:eventKey/info"
      getComponent={() => import('./routes/event-info').then(def)}
    />
  </Router>
)

render(<App />, document.body)
