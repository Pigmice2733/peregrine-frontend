import './style.css'
import { Router } from './router'
import { h, Fragment } from 'preact'
import 'preact/debug'
import { DialogDisplayer } from './components/dialog'

const App = () => (
  <Fragment>
    <div>
      <Router
        routes={[
          {
            path: '/',
            component: () => import('./routes/home'),
          },
          {
            path: '/events/:eventKey',
            component: () => import('./routes/event'),
          },
          {
            path: '/events/:eventKey/matches/:matchKey',
            component: () => import('./routes/event-match'),
          },
          {
            path: '/events/:eventKey/matches/:matchKey/scout',
            component: () => import('./routes/scout'),
          },
          {
            path: '/events/:eventKey/teams/:teamNum',
            component: () => import('./routes/event-team'),
          },
          {
            path: '/users',
            component: () => import('./routes/users'),
          },
          {
            path: '/register',
            component: () => import('./routes/register'),
          },
          {
            path: '/login',
            component: () => import('./routes/login'),
          },
          {
            path: '/leaderboard',
            component: () => import('./routes/leaderboard'),
          },
        ]}
      />
    </div>
    <DialogDisplayer />
  </Fragment>
)

export default App
