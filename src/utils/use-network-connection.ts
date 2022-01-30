import { useEffect, useState } from 'preact/hooks'

export const enum ConnectionType {
  /** No Internet */
  Offline,
  /** Slow WiFi (slower than 4G) or cellular connection */
  Limited,
  /** Strong WiFi connection (4G speed or faster) */
  Default,
}

declare global {
  // http://wicg.github.io/netinfo/#connection-types
  type ConnectionType =
    | 'bluetooth'
    | 'cellular'
    | 'ethernet'
    | 'none'
    | 'mixed'
    | 'other'
    | 'unknown'
    | 'wifi'
    | 'wimax'

  // http://wicg.github.io/netinfo/#effectiveconnectiontype-enum
  type EffectiveConnectionType = '2g' | '3g' | '4g' | 'slow-2g'

  // http://wicg.github.io/netinfo/#dom-megabit
  type Megabit = number
  // http://wicg.github.io/netinfo/#dom-millisecond
  type Millisecond = number

  // http://wicg.github.io/netinfo/#networkinformation-interface
  interface NetworkInformation extends EventTarget {
    // http://wicg.github.io/netinfo/#type-attribute
    readonly type?: ConnectionType
    // http://wicg.github.io/netinfo/#effectivetype-attribute
    readonly effectiveType?: EffectiveConnectionType
    // http://wicg.github.io/netinfo/#downlinkmax-attribute
    readonly downlinkMax?: Megabit
    // http://wicg.github.io/netinfo/#downlink-attribute
    readonly downlink?: Megabit
    // http://wicg.github.io/netinfo/#rtt-attribute
    readonly rtt?: Millisecond
    // http://wicg.github.io/netinfo/#savedata-attribute
    readonly saveData?: boolean
    // http://wicg.github.io/netinfo/#handling-changes-to-the-underlying-connection
    onchange?: EventListener
  }

  interface Navigator {
    connection?: NetworkInformation
  }
}

let defaultConnectionState = ConnectionType.Limited

export const useNetworkConnection = () => {
  const [connectionState, _setConnectionState] = useState(
    defaultConnectionState,
  )
  const setConnectionState = (state: ConnectionType) => {
    _setConnectionState(state)
    defaultConnectionState = state
  }
  useEffect(() => {
    const connection = navigator.connection
    const updateConnectionStatus = () => {
      if (navigator.onLine) {
        if (
          connection?.effectiveType === '4g' &&
          (connection.type === 'wifi' || connection.type === 'ethernet')
        ) {
          setConnectionState(ConnectionType.Default)
        } else {
          setConnectionState(ConnectionType.Limited)
        }
      } else {
        setConnectionState(ConnectionType.Offline)
      }
    }
    updateConnectionStatus()
    // eslint-disable-next-line no-unused-expressions
    connection?.addEventListener('change', updateConnectionStatus)
    window.addEventListener('online', updateConnectionStatus)

    return () => {
      // eslint-disable-next-line no-unused-expressions
      connection?.removeEventListener('change', updateConnectionStatus)
      window.removeEventListener('online', updateConnectionStatus)
    }
  }, [])

  return connectionState
}
