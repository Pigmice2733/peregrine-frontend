import { h, render, FunctionalComponent } from 'preact'
import { Router, Route } from 'preact-router'

import './style'
import 'preact/debug'
import Spinner from './components/spinner'
import { usePromise } from './utils/use-promise'

const asyncRoute = <Props extends any>(
  modulePromise: () => Promise<{ default: FunctionalComponent<Props> }>,
) => (props: Props) => {
  const Module = usePromise(modulePromise)
  return Module ? <Module.default {...props} /> : <Spinner />
}

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
      // @ts-ignore
      component={asyncRoute(() => import('./routes/register'))}
    />
  </Router>
)

if (process.env.NODE_ENV !== 'production') {
  while (document.body.lastChild) {
    document.body.removeChild(document.body.lastChild)
  }
}

render(<App />, document.body)
