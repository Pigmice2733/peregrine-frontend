import { FunctionComponent, Component } from 'preact'
import { jsx } from 'preact/jsx-runtime'

/**
 * Check if two objects have a different shape
 */
function shallowDiffers(
  a: Record<string, unknown>,
  b: Record<string, unknown>,
): boolean {
  for (const i in a) if (!(i in b)) return true
  for (const i in b) if (a[i] !== b[i]) return true
  return false
}

/**
 * Memoize a component, so that it only updates when the props actually have
 * changed. This was previously known as `React.pure`.
 * @param areValuesEqual Custom equality function
 */
export function memo<Props>(
  c: FunctionComponent<Props>,
  areValuesEqual?: (prev: object, next: object) => boolean,
) {
  function shouldUpdate(this: Component<Props>, nextProps: any) {
    const ref = this.props.ref
    // eslint-disable-next-line eqeqeq
    const updateRef = ref == nextProps.ref
    if (!updateRef) {
      // @ts-expect-error
      if (ref.call) ref(null)
      // @ts-expect-error
      else ref.current = null
    }
    return (
      (areValuesEqual
        ? !areValuesEqual(this.props, nextProps)
        : shallowDiffers(this.props, nextProps)) || !updateRef
    )
  }

  function Memoed(this: Component<Props>, props: Props) {
    this.shouldComponentUpdate = shouldUpdate
    return jsx(c, props)
  }
  Memoed.displayName = 'Memo(' + (c.displayName || c.name) + ')'
  Memoed._forwarded = true
  return Memoed as FunctionComponent<Props>
}
