import { FunctionComponent, Component, h } from 'preact'

/**
 * Check if two objects have a different shape
 */
function shallowDiffers(a: object, b: object): boolean {
  for (const i in a) if (!(i in b)) return true
  // @ts-ignore
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
      // @ts-ignore
      if (ref.call) ref(null)
      // @ts-ignore
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
    return h(c, Object.assign({}, props))
  }
  Memoed.displayName = 'Memo(' + (c.displayName || c.name) + ')'
  Memoed._forwarded = true
  return Memoed as FunctionComponent<Props>
}
