import { ComponentType, VNode, h } from 'preact'
import { useState, useEffect, useMemo, useLayoutEffect } from 'preact/hooks'
import { parse, match, exec } from 'matchit'
import Spinner from './components/spinner'
import { updateUrl, useUrl } from './url-manager'

type AnyComponent = ComponentType<any> | ((props: any) => VNode<any> | null)

interface ComponentModule {
  default: AnyComponent
}

interface Route {
  path: string
  component: () => Promise<ComponentModule>
}

export const route = (url: string) => {
  updateUrl(url)
}

export const Router = ({ routes }: { routes: Route[] }) => {
  const path = useUrl((loc) => loc.pathname)

  const parsedRoutes = useMemo(() => routes.map((route) => parse(route.path)), [
    routes,
  ])

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

    addEventListener('click', clickListener)
    return () => removeEventListener('click', clickListener)
  }, [parsedRoutes])

  const [
    ResolvedComponent,
    setResolvedComponent,
  ] = useState<AnyComponent | null>(null)

  const [routeProps, setRouteProps] = useState<any>(null)

  const matchingRoute = match(path, parsedRoutes)
  const matchingFullRoute =
    matchingRoute.length > 0 ? matchingRoute[0].old : null
  const matchingRouteObj = routes.find((r) => r.path === matchingFullRoute)

  // This has to be a layout effect because it needs to run
  // before other components that are url-dependent are rendered
  useLayoutEffect(() => {
    setResolvedComponent(null)
    if (matchingRouteObj)
      matchingRouteObj.component().then((comp) => {
        setResolvedComponent(() => comp.default)
        setRouteProps(exec(path, matchingRoute))
      })
  }, [matchingRoute, matchingRouteObj, path])

  if (matchingFullRoute === null) return <h1>404</h1>

  if (ResolvedComponent) return <ResolvedComponent {...routeProps} />

  return <Spinner />
}
