import { h, render } from 'preact'
import './style.css'
import { useRouter } from './router'

const App = () =>
  useRouter([
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
  ])

if (process.env.NODE_ENV === 'development') {
  import('preact/debug')
  while (document.body.lastChild) {
    document.body.removeChild(document.body.lastChild)
  }
}

const el = document.createElement('div')
document.body.append(el)

render(<App />, el)
