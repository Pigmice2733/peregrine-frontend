import { h, render, ComponentType, VNode } from 'preact'
import { parse, match, Segment, exec } from 'matchit'

import './style'
import Spinner from './components/spinner'
import { usePromise } from './utils/use-promise'
import { useEffect, useState } from 'preact/hooks'

type ComponentModule = {
  default: ComponentType<any> | ((props: any) => VNode<any> | null)
}

interface Route {
  path: string
  component: () => Promise<ComponentModule>
}

interface URLComponentMap {
  [url: string]: () => Promise<ComponentModule>
}

const useRouter = (routes: Route[]) => {
  const [parsedRoutes, setParsedRoutes] = useState<Segment[][] | null>(null)
  const [components, setComponents] = useState<URLComponentMap>({})
  const [url, setUrl] = useState(window.location.pathname)

  useEffect(() => {
    setComponents(
      routes.reduce<URLComponentMap>((acc, r) => {
        acc[r.path] = r.component
        return acc
      }, {}),
    )
  }, [])

  useEffect(() => {
    setParsedRoutes(routes.map(route => parse(route.path)))
  }, [])

  useEffect(() => {
    // when the url changes via pushstate or via browser back/forwards
    // update the url in state and rerender
    const historyListener = (e: PopStateEvent) => {
      e.preventDefault()
      e.stopPropagation()
      e.stopImmediatePropagation()
      setUrl(location.pathname)
    }
    window.addEventListener('popstate', historyListener)
    return () => window.removeEventListener('popstate', historyListener)
  }, [])

  useEffect(() => {
    if (!parsedRoutes) return

    // when a link is clicked, don't do a full reload, intercept and update state
    const clickListener = (e: MouseEvent) => {
      // ignore events the browser takes care of already:
      if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || e.button !== 0)
        return
      const t = (e.target as HTMLElement).closest('a')

      if (!t) return

      const href = t.getAttribute('href')

      if (!href) return

      // if link is handled by the router, prevent browser defaults
      if (match(href, parsedRoutes).length !== 0) {
        setUrl(href)
        history.pushState(null, '', href)
        e.preventDefault()
        e.stopImmediatePropagation()
        e.stopPropagation()
        return false
      }
    }

    window.addEventListener('click', clickListener)

    return () => window.removeEventListener('click', clickListener)
  }, [parsedRoutes])

  if (!parsedRoutes) return <Spinner />

  const matchingRoute = match(url, parsedRoutes)

  if (matchingRoute.length === 0) {
    return <h1>404</h1>
  }

  const matchingFullRoute = matchingRoute[0].old

  const routeProps = exec(url, matchingRoute)

  const component = usePromise(components[matchingFullRoute])
  const Comp = component && component.default
  const v = Comp ? (
    <div>
      <Comp {...routeProps} />
    </div>
  ) : (
    <Spinner />
  )

  return v
}

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
