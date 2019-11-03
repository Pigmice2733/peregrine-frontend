import { ComponentType, VNode, h } from 'preact'
import { useState, useEffect, useMemo } from 'preact/hooks'
import { parse, match, exec } from 'matchit'
import Spinner from './components/spinner'

type AnyComponent = ComponentType<any> | ((props: any) => VNode<any> | null)

interface ComponentModule {
  default: AnyComponent
}

interface Route {
  path: string
  component: () => Promise<ComponentModule>
}

const routers: ((url: string) => void)[] = []

export const route = (url: string) => {
  routers.forEach(router => router(url))
  history.pushState(null, '', url)
}

export const Router = ({
  routes,
  onChange,
}: {
  routes: Route[]
  onChange: () => void
}) => {
  const [url, setUrl] = useState(window.location.pathname)

  const parsedRoutes = useMemo(() => routes.map(route => parse(route.path)), [
    routes,
  ])

  useEffect(() => {
    routers.push(setUrl)
  }, [])

  useEffect(() => {
    // when the url changes via pushstate or via browser back/forwards
    // update the url in state and rerender
    const historyListener = (e: PopStateEvent) => {
      e.preventDefault()
      e.stopPropagation()
      e.stopImmediatePropagation()
      setUrl(location.pathname)
      setResolvedComponent(null)
    }
    window.addEventListener('popstate', historyListener)
    return () => window.removeEventListener('popstate', historyListener)
  }, [])

  useEffect(() => {
    onChange()
  }, [url, onChange])

  useEffect(() => {
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
        route(href)
        e.preventDefault()
        e.stopImmediatePropagation()
        e.stopPropagation()
        return false
      }
    }

    window.addEventListener('click', clickListener)

    return () => window.removeEventListener('click', clickListener)
  }, [parsedRoutes])

  const matchingRoutes = match(url, parsedRoutes)
  const matchingFullRoute =
    matchingRoutes.length > 0 ? matchingRoutes[0].old : null

  const [
    ResolvedComponent,
    setResolvedComponent,
  ] = useState<AnyComponent | null>(null)

  useEffect(() => {
    const matchingRouteObj = routes.find(r => r.path === matchingFullRoute)
    if (matchingRouteObj)
      matchingRouteObj.component().then(comp => {
        setResolvedComponent(() => comp.default)
      })
  }, [routes, matchingFullRoute])

  if (matchingFullRoute === null) {
    return <h1>404</h1>
  }

  const routeProps = exec(url, matchingRoutes)

  if (ResolvedComponent) return <ResolvedComponent {...routeProps} />

  return <Spinner />
}
