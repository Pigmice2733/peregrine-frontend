import { ComponentType, VNode } from 'preact'
import { useState, useEffect, useMemo, useLayoutEffect } from 'preact/hooks'
import { parse, match, exec } from 'matchit'
import Spinner from '@/components/spinner'
import { updateUrl, useUrl } from './url-manager'
import Alert, { AlertType } from '@/components/alert'
import { css } from 'linaria'
import { close } from '@/icons/close'
import Icon from './components/icon'
import { createShadow } from './utils/create-shadow'

type AnyComponent = ComponentType<any> | ((props: any) => VNode<any> | null)

interface ComponentModule {
  default: AnyComponent
}

interface Route {
  path: string
  component: () => Promise<ComponentModule>
}

interface Alert {
  type: AlertType
  message: string | h.JSX.Element
}

let alertsOuter: Alert[] = []

const alertsListeners = new Set<(alerts: Alert[]) => void>()

const handleAlertsChange = () =>
  alertsListeners.forEach((listener) => listener(alertsOuter))

export const createAlert = (alert: Alert) => {
  alertsOuter = alertsOuter.concat(alert)
  handleAlertsChange()
}

export const route = (url: string, alert?: Alert) => {
  if (alert) {
    alertsOuter = alertsOuter.concat(alert)
  } else {
    alertsOuter = []
  }
  handleAlertsChange()
  updateUrl(url)
}

export const Router = ({ routes }: { routes: Route[] }) => {
  const path = useUrl((loc) => loc.pathname)

  const parsedRoutes = useMemo(() => routes.map((route) => parse(route.path)), [
    routes,
  ])

  const [alerts, setAlerts] = useState(alertsOuter)

  useEffect(() => {
    alertsListeners.add(setAlerts)

    return () => alertsListeners.delete(setAlerts)
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
      matchingRouteObj
        .component()
        .then((comp) => {
          setResolvedComponent(() => comp.default)
          setRouteProps(exec(path, matchingRoute))
        })
        .catch(() => location.reload())
  }, [matchingRoute, matchingRouteObj, path])

  if (matchingFullRoute === null) return <h1>404</h1>

  if (ResolvedComponent) {
    return (
      <>
        <div class={alertListStyle}>
          {alerts.map((alert, i) => (
            // eslint-disable-next-line caleb/react/jsx-key
            <Alert type={alert.type} class={alertStyle}>
              <div>{alert.message}</div>
              <button
                class={closeButtonStyle}
                onClick={() => {
                  alertsOuter.splice(i, 1)
                  // Need to copy the array so that setState triggers a rerender
                  // Otherwise it is still pointing to the old array
                  alertsOuter = alertsOuter.slice()
                  handleAlertsChange()
                }}
              >
                <Icon icon={close} />
              </button>
            </Alert>
          ))}
        </div>
        <ResolvedComponent {...routeProps} />
      </>
    )
  }

  return <Spinner />
}

const alertListStyle = css`
  position: fixed;
  z-index: 5;
  left: 50%;
  transform: translateX(-50%);
`

const alertStyle = css`
  display: grid;
  grid-template-columns: 1fr auto;
  grid-gap: 0.5rem;
  align-items: center;
  box-shadow: ${createShadow(1)};
`

const closeButtonStyle = css`
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 1.7rem;
  height: 1.7rem;
  border-radius: 50%;
  outline: none;
  transition: background 0.2s ease;

  &:hover,
  &:focus {
    background: rgba(0, 0, 0, 0.1);
  }

  & svg {
    width: 1.2rem;
  }
`
