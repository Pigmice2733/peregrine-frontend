import { h, render } from 'preact'
import { Router, Route } from 'preact-router'
import LoadData from './load-data'

import './style'
import { initDevTools } from 'preact/devtools/devtools'
import Spinner from './components/spinner'

const asyncRoute = <Props extends {}>(
  modulePromise: () => Promise<{ default: (props: Props) => JSX.Element }>,
) => (props: Props) => (
  <LoadData
    data={{ Module: modulePromise }}
    renderSuccess={({ Module }) =>
      Module ? <Module.default {...props} /> : <Spinner />
    }
  />
)

const App = () => (
  <Router>
    <Route<{}> path="/" component={asyncRoute(() => import('./routes/home'))} />
    <Route<{ eventKey: string }>
      path="/events/:eventKey"
      component={asyncRoute(() => import('./routes/event'))}
    />
    <Route<{ eventKey: string; matchKey: string }>
      path="/events/:eventKey/matches/:matchKey"
      component={asyncRoute(() => import('./routes/event-match'))}
    />
    <Route<{ eventKey: string; matchKey: string }>
      path="/events/:eventKey/matches/:matchKey/scout"
      component={asyncRoute(() => import('./routes/scout'))}
    />
    <Route<{ eventKey: string; teamNum: string }>
      path="/events/:eventKey/teams/:teamNum"
      component={asyncRoute(() => import('./routes/event-team'))}
    />
    <Route<{}>
      path="/users"
      component={asyncRoute(() => import('./routes/users'))}
    />
    <Route<{}>
      path="/register"
      component={asyncRoute(() => import('./routes/register'))}
    />
  </Router>
)

if (process.env.NODE_ENV !== 'production') {
  while (document.body.lastChild) {
    document.body.removeChild(document.body.lastChild)
  }
}

render(<App />, document.body, document.body.lastElementChild || undefined)

if (process.env.NODE_ENV !== 'production') {
  initDevTools()
}
