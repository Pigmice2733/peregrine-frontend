import { ComponentType, VNode, h } from 'preact'
import { useState, useEffect, useMemo } from 'preact/hooks'
import { Segment, parse, match, exec } from 'matchit'
import Spinner from './components/spinner'
import { usePromise } from './utils/use-promise'

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

const routers: ((url: string) => void)[] = []

export const route = (url: string) => {
  routers.forEach(router => {
    router(url)
  })
}

export const useRouter = (routes: Route[]) => {
  const [url, setUrl] = useState(window.location.pathname)
  const updateUrl = (url: string) => {
    setUrl(url)
    history.pushState(null, '', url)
  }

  const components = useMemo(
    () =>
      routes.reduce<URLComponentMap>((acc, r) => {
        acc[r.path] = r.component
        return acc
      }, {}),
    [],
  )

  const parsedRoutes = useMemo(() => routes.map(route => parse(route.path)), [])

  useEffect(() => {
    routers.push(updateUrl)
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
        updateUrl(href)
        e.preventDefault()
        e.stopImmediatePropagation()
        e.stopPropagation()
        return false
      }
    }

    window.addEventListener('click', clickListener)

    return () => window.removeEventListener('click', clickListener)
  }, [parsedRoutes])

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
