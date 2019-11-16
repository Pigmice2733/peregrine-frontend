import { JSX, FunctionComponent, h } from 'preact'
import { useRef, useLayoutEffect } from 'preact/hooks'

const springed = Symbol('springed')

interface SpringedNumberState {
  lastTime: number
  velocity: number
  position: number
}

interface SpringOpts {
  mass: number
  springStrength: number
  friction: number
}

/** Map of springs to their results */
type SpringCache = Map<Springed<unknown>, { state: unknown; value: unknown }>

const enum SpringType {
  number,
  other,
}

type UnSpring<T> = T extends Springed<infer U>
  ? U extends object
    ? UnSpringObject<U>
    : U
  : T

// This is a conditional type so that TS will inline the result of the type when you hover over it.
// If it isn't conditional, it doesn't inline it. IDK why.
type UnSpringObject<T extends object> = T extends object
  ? { [K in keyof T]: UnSpring<T[K]> }
  : never

interface Springed<T, S = any> {
  [springed]: true
  computeValue(
    state: S | undefined,
    springCache: SpringCache,
  ): { state: S; value: T }
  compose(createSpring: CreateSpring): Springed<T>
  target?: any
  measure: (element: HTMLElement, state: S | undefined) => S | undefined
  type: SpringType
}

interface CreateSpring {
  /** Creates a spring that smoothly transitions to the specified target */
  (target: number): Springed<number>
  /** Composes another spring, "spring on a spring" */
  <T>(target: Springed<T>): Springed<T>
  /** General overloads because https://github.com/microsoft/TypeScript/issues/14107 */
  <T>(target: Springed<T> | number): Springed<T | number>
  <T extends Springed<any>>(target: T | number): T | Springed<number>
}

export const initSpring = ({
  friction = 0.007,
  mass = 0.0003,
  springStrength = 0.08,
}: Partial<SpringOpts> = {}) => {
  const createSpring: CreateSpring = <T extends any>(
    target: number | Springed<T>,
  ): Springed<number> | Springed<T> => {
    if (typeof target === 'number') {
      const spring: Springed<number, SpringedNumberState> = {
        [springed]: true,
        computeValue: state => {
          if (!state) console.log('no s', state)
          const v = getSpringFramePosition(
            target,
            state || {
              position: target,
              lastTime: Date.now(),
              velocity: 0,
            },
            springStrength,
            friction,
            mass,
          )
          return v
        },
        compose: createSpring => createSpring(spring),
        type: SpringType.number,
        measure: (_el, state) => state,
        target,
      }
      return spring
    }
    // Target is Springed<number>
    if (isSpringedNumber(target)) {
      interface WrappedSpringState {
        subSpringState: unknown
        state: SpringedNumberState | undefined
      }
      const subSpring = target

      const spring: Springed<number, WrappedSpringState> = {
        [springed]: true,
        computeValue(s, springCache) {
          const subSpringState = s?.subSpringState
          const subSpringResult = computeSpring(
            subSpring,
            subSpringState,
            springCache,
          )
          const target = subSpringResult.value
          const springResult = getSpringFramePosition(
            target,
            s?.state || {
              lastTime: Date.now(),
              position: computeSpring(subSpring, subSpringState, springCache)
                .value,
              velocity: 0,
            },
            springStrength,
            friction,
            mass,
          )
          const thisSpringState = springResult.state
          const value = springResult.value
          return {
            value,
            state: {
              subSpringState: subSpringResult.state,
              state: thisSpringState,
            },
          }
        },
        measure: (el, s) => ({
          subSpringState: subSpring.measure(el, s?.subSpringState),
          state: s?.state,
        }),
        compose: createSpring => createSpring(spring),
        type: SpringType.number,
      }
      return spring
    }

    // Target is Springed<T>
    return target.compose(createSpring)
  }
  return createSpring
}

const isSpringedNumber = (
  s: Springed<unknown, unknown>,
): s is Springed<number> => s.type === SpringType.number

type TemplateSpringState = { [i: number]: unknown }

type TemplateLiteralExpression = string | number | boolean

export const templateSpring = (
  strings: TemplateStringsArray,
  ...expressions: (TemplateLiteralExpression | Springed<string | number>)[]
): Springed<string, TemplateSpringState> => {
  return {
    compose: createSpring =>
      templateSpring(
        strings,
        // If it is a string passed directly in, it cannot be springed i.e. `${"hi"}`
        // But if it is a number passed in directly, or an existing Springed<any>, it should be springed/re-springed
        ...expressions.map(e =>
          typeof e === 'number' || typeof e === 'object' ? createSpring(e) : e,
        ),
      ),
    target: expressions,
    measure: (el, state) =>
      expressions.reduce((state, expr, i) => {
        if (isSpringed(expr)) state[i] = expr.measure(el, state[i])
        return state
      }, state || {}),
    computeValue: (state, springCache) => {
      // console.log(state && state[0])
      const newState: TemplateSpringState = {}
      const computedExpressions: TemplateLiteralExpression[] = expressions.map(
        (expr, i) => {
          if (!isSpringed(expr)) return expr
          const matchingState = state?.[i]
          const springResult = computeSpring(expr, matchingState, springCache)
          newState[i] = springResult.state
          return springResult.value
        },
      )
      const value = strings.reduce((builtString, chunk, i) => {
        const expr = computedExpressions[i]
        return builtString + chunk + (expr === undefined ? '' : expr)
      }, '')
      return { state: newState, value }
    },
    type: SpringType.other,
    [springed]: true,
  }
}

/** Array of the sub spring states */
type DerivedSpringState = unknown[]

export const createDerivedSpring = <T extends Springed<any>[], O>(
  subSprings: T,
  cb: (computedValues: { [K in keyof T]: UnSpring<T[K]> }) => O,
): Springed<O> => {
  const spring: Springed<O, DerivedSpringState> = {
    [springed]: true,
    type: SpringType.other,
    // Here composing the spring means re-springing all the input springs
    compose: createSpring =>
      createDerivedSpring(subSprings.map(createSpring), cb as any),
    measure: (el, subSpringStates) => {
      return subSprings.map((subSpring, i) =>
        subSpring.measure(el, subSpringStates?.[i]),
      )
    },
    computeValue: (subSpringStates, springCache) => {
      const subSpringResults = subSprings.map((subSpring, i) => {
        return subSpring.computeValue(subSpringStates?.[i], springCache)
      })
      // eslint-disable-next-line caleb/standard/no-callback-literal
      const value = cb(subSpringResults.map(r => r.value) as any)
      return { state: subSpringResults.map(r => r.state), value }
    },
  }
  return spring
}

interface DerivedSpringedNumberState {
  callbackResultState: unknown
  subSpringStates: unknown[]
}

export const createDerivedNumberSpring = <T extends Springed<any>[]>(
  subSprings: T,
  cb: (
    computedValues: { [K in keyof T]: UnSpring<T[K]> },
  ) => number | Springed<number>,
): Springed<number> => {
  const spring: Springed<number, DerivedSpringedNumberState> = {
    [springed]: true,
    type: SpringType.other,
    compose: createSpring =>
      createDerivedNumberSpring(subSprings, computedValues => {
        const v = cb(computedValues)
        return createSpring(v)
      }),
    measure: (el, s) => ({
      subSpringStates: subSprings.map((subSpring, i) =>
        subSpring.measure(el, s?.subSpringStates?.[i]),
      ),
      callbackResultState: s?.callbackResultState,
    }),
    computeValue: (s, springCache) => {
      const subSpringResults = subSprings.map((subSpring, i) => {
        return subSpring.computeValue(s?.subSpringStates?.[i], springCache)
      })
      // eslint-disable-next-line caleb/standard/no-callback-literal
      const callbackResult = cb(subSpringResults.map(r => r.value) as any)
      const callbackResultState = s?.callbackResultState
      const newSubSpringStates = subSpringResults.map(r => r.state)
      if (isSpringed(callbackResult)) {
        const { state, value } = computeSpring(
          callbackResult,
          callbackResultState,
          springCache,
        )
        return {
          state: {
            callbackResultState: state,
            subSpringStates: newSubSpringStates,
          },
          value,
        }
      }
      return {
        state: { callbackResultState, subSpringStates: newSubSpringStates },
        value: callbackResult,
      }
    },
  }
  return spring
}

interface SpringedObjectState {
  /** Spring state by key */
  [key: string]: unknown
}

export const springedObject = <T extends object>(
  input: T,
): Springed<UnSpringObject<T>, SpringedObjectState> => {
  const spring: Springed<UnSpringObject<T>, SpringedObjectState> = {
    [springed]: true,
    compose(wrapperSpring) {
      const modifiedObject = Object.fromEntries(
        Object.entries(input).map(([key, val]) => {
          if (isSpringed(val) || typeof val === 'number')
            return [key, wrapperSpring]
          return [key, val]
        }),
      )
      return springedObject(modifiedObject) as Springed<UnSpringObject<T>>
    },
    target: input,
    measure(el, state) {
      const newState: SpringedObjectState = {}
      Object.entries(input).forEach(([key, val]: [string, unknown]) => {
        if (isSpringed(val)) newState[key] = val.measure(el, state?.[key])
      })
      return newState
    },
    computeValue(state, springCache) {
      const newState: SpringedObjectState = {}
      const value = Object.fromEntries(
        Object.entries(input).map(([key, val]: [string, unknown]) => {
          if (!isSpringed(val)) return [key, val]
          const result = computeSpring(
            val as Springed<unknown>,
            state?.[key],
            springCache,
          )
          newState[key] = result.state
          return [key, result.value]
        }),
      ) as UnSpringObject<T>
      return { state: newState, value }
    },
    type: SpringType.other,
  }
  return spring
}

const computeSpring = <T extends any = unknown, S = any>(
  spring: Springed<T, S>,
  state: S | undefined,
  springCache: SpringCache,
) => {
  const cachedMatch = springCache.get(spring)
  if (cachedMatch) return cachedMatch as { state: S; value: T }
  const result = spring.computeValue(state, springCache)
  springCache.set(spring, result)
  return result
}

const getSpringFramePosition = (
  target: number,
  state: SpringedNumberState,
  springStrength: number,
  friction: number,
  mass: number,
) => {
  const currentTime = Date.now()
  const displacement = target - state.position
  if (Math.abs(displacement) < 1e-3)
    return {
      state: { lastTime: currentTime, velocity: 0, position: target },
      value: target,
    }
  const springForce = springStrength * displacement
  // Friction isn't really proportional to velocity
  // But this makes it "feel" right
  // And it makes everything way easier to tune
  const frictionalForce = friction * state.velocity
  const force = springForce - frictionalForce
  // f = ma
  const acceleration = force / mass
  const dTime = (currentTime - state.lastTime) / 1000
  state.lastTime = currentTime
  // v' = v + at
  state.velocity += acceleration * dTime
  // x' = x + vt
  state.position += state.velocity * dTime
  return { state, value: state.position }
}

/** Offset value */
type MeasuredSpringState = number

export const measure = (
  getOffset: (elSnapshot: HTMLElement) => number,
): Springed<number, MeasuredSpringState> => {
  const spring: Springed<number, MeasuredSpringState> = {
    [springed]: true,
    type: SpringType.other,
    measure: (el, state) => {
      return getOffset(el)
    },
    compose: wrapperSpring =>
      createDerivedNumberSpring([spring], ([offset]) => {
        // console.log(offset)
        const wrappedSpring = wrapperSpring(offset)
        // const originalCompute = wrappedSpring.computeValue
        // wrappedSpring.computeValue = (state, springCache) => {

        // }
        return offset
      }),
    computeValue(offset) {
      const value = offset || 0
      return {
        state: offset || 0,
        value,
      }
    },
  }
  return spring
}

const isSpringed = (prop: any): prop is Springed<any> => prop[springed]

type AnimatifyProps<Props> = {
  [Prop in keyof Props]: Props[Prop] | Springed<AnimatifyProps<Props[Prop]>>
}

type AnimatedObject = {
  [El in keyof JSX.IntrinsicElements]: FunctionComponent<
    AnimatifyProps<JSX.IntrinsicElements[El]>
  >
}

// We need to make sure to return the same component between multiple renders
// so that state/refs are preserved between renders
// Otherwise a different component is returned and everything is reset
const animatedComponentCache: Partial<AnimatedObject> = {}

export const Animated = new Proxy<AnimatedObject>({} as any, {
  get: (
    _target,
    El: keyof AnimatedObject,
  ): AnimatedObject[keyof AnimatedObject] => {
    const cachedEl = animatedComponentCache[El]
    if (cachedEl) return cachedEl
    const Component = (
      props: AnimatifyProps<JSX.IntrinsicElements[keyof AnimatedObject]>,
    ) => {
      const propsEntries = Object.entries(props)
      const staticProps = Object.fromEntries(
        propsEntries.filter(([, val]) => !isSpringed(val)),
      )
      const propsSpring = springedObject(
        Object.fromEntries(
          propsEntries.filter(([, val]) => isSpringed(val)),
        ) as typeof props,
      )
      const elementRef = useRef<Element | undefined>()
      const propsStateRef = useRef<SpringedObjectState | undefined>(undefined)
      useLayoutEffect(() => {
        const updateComponentSprings = (propsChanged = false) => () => {
          const element = elementRef.current
          const tweenedPropsResult = computeSpring(
            propsSpring,
            propsStateRef.current,
            new Map(),
          )
          const tweenedProps = tweenedPropsResult.value
          propsStateRef.current = tweenedPropsResult.state
          if (element) {
            if (typeof tweenedProps.style === 'string') {
              ;(element as HTMLElement).style.cssText = tweenedProps.style
            } else {
              for (const key in tweenedProps.style) {
                // @ts-ignore
                ;(element as HTMLElement).style[key] = tweenedProps.style[key]
              }
            }
            for (const key in tweenedProps) {
              if (key !== 'style') {
                ;(element as HTMLElement).setAttribute(
                  key,
                  tweenedProps[key as keyof typeof props],
                )
              }
            }

            if (propsChanged) {
              propsStateRef.current = propsSpring.measure(
                element as HTMLElement,
                propsStateRef.current,
              )
              updateComponentSprings(false)
            }
          }
          timeoutId = setTimeout(
            () =>
              (rafId = requestAnimationFrame(updateComponentSprings(false))),
            10,
          ) as any
        }
        let rafId = requestAnimationFrame(updateComponentSprings(true))
        let timeoutId: number
        return () => {
          clearTimeout(timeoutId)
          cancelAnimationFrame(rafId)
        }
      })
      return <El ref={elementRef} {...staticProps} />
    }
    animatedComponentCache[El] = Component
    return Component
  },
})

const colorRegex = /[.\d]+/g

const colorEl = document.createElement('div')
document.body.append(colorEl)

export const tweenColor = (
  spring: CreateSpring,
  color: string,
): Springed<string> => {
  colorEl.style.color = color
  // We have to check that the property still exists, otherwise the property has been rejected by the css parser
  const targetColor = colorEl.style.color && getComputedStyle(colorEl).color
  colorEl.style.color = ''
  const [targetRed, targetGreen, targetBlue, targetAlpha] =
    targetColor?.match(colorRegex) || []

  return createDerivedSpring(
    [targetRed, targetGreen, targetBlue, targetAlpha].map(v =>
      spring(Number(v || 0)),
    ),
    ([red, green, blue, alpha]) => `rgba(${red},${green},${blue},${alpha})`,
  )
}
