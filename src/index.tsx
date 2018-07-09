import { h, render } from 'preact'
import { Router } from 'preact-router'
import AsyncRoute from 'preact-async-route'
import './style.css'

const def = (m: any) => m.default

const App = () => (
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

render(
  <App />,
  document.body,
  document.getElementById('prerender') || undefined,
)
