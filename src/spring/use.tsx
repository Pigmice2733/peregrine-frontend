import { JSX, FunctionComponent, h } from 'preact'
import { useRef, useEffect } from 'preact/hooks'

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
  computeValue(state: S, springCache: SpringCache): { state: S; value: T }
  compose(createSpring: CreateSpring): Springed<T>
  getInitialState: (springCache: SpringCache) => S
  target?: any
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
          const v = getSpringFramePosition(
            target,
            state,
            springStrength,
            friction,
            mass,
          )
          return v
        },
        compose: createSpring => createSpring(spring),
        type: SpringType.number,
        target,
        getInitialState: () => ({
          position: target,
          lastTime: Date.now(),
          velocity: 0,
        }),
      }
      return spring
    }
    // Target is Springed<number>
    if (isSpringedNumber(target)) {
      interface WrappedSpringState {
        subSpringState: unknown
        state: SpringedNumberState
      }
      const subSpring = target

      const spring: Springed<number, WrappedSpringState> = {
        [springed]: true,
        computeValue({ subSpringState, state }, springCache) {
          const subSpringResult = computeSpring(
            subSpring,
            subSpringState,
            springCache,
          )
          const target = subSpringResult.value
          const springResult = getSpringFramePosition(
            target,
            state,
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
        compose: createSpring => createSpring(spring),
        type: SpringType.number,
        getInitialState(springCache) {
          const subSpring = target
          const subSpringState = target.getInitialState(springCache)
          return {
            state: {
              lastTime: Date.now(),
              position: computeSpring(subSpring, subSpringState, springCache)
                .value,
              velocity: 0,
            },
            subSpring,
            subSpringState,
          }
        },
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
  ...expressions: (
    | TemplateLiteralExpression
    | Springed<string | number, unknown>)[]
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
    computeValue: (state, springCache) => {
      const newState: TemplateSpringState = {}
      const computedExpressions: TemplateLiteralExpression[] = expressions.map(
        (expr, i) => {
          if (!isSpringed(expr)) return expr
          const matchingState =
            state[i] === undefined
              ? expr.getInitialState(springCache)
              : state[i]
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
    getInitialState: () => ({}),
  }
}

/** Array of the sub spring states */
type DerivedSpringState = unknown[]

export const createDerivedSpring = <T extends any>(
  cb: (evalSpring: <U>(s: Springed<U>) => U) => T,
) => {
  const spring: Springed<T, DerivedSpringState> = {
    [springed]: true,
    type: SpringType.other,
    compose: createSpring =>
      createDerivedSpring(evalSpring => {
        const value = evalSpring(spring)
        if (typeof value !== 'number')
          throw new TypeError('Cannot wrap a non-number from derived spring')
        return evalSpring(createSpring(value))
      }),
    computeValue: (subSpringStates, springCache) => {
      let i = 0
      const newSubSpringStates: unknown[] = []
      const evalSpring = <U extends any>(subSpring: Springed<U>) => {
        const subSpringState =
          subSpringStates[i] === undefined
            ? subSpring.getInitialState(springCache)
            : subSpringStates[i]
        const result = computeSpring(subSpring, subSpringState, springCache)
        newSubSpringStates[i] = result.state
        i++
        return result.value
      }
      const value = cb(evalSpring)
      return { state: newSubSpringStates, value }
    },
    getInitialState: () => [],
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
    compose(createSpring) {
      const modifiedObject = Object.fromEntries(
        Object.entries(input).map(([key, val]) => {
          if (isSpringed(val) || typeof val === 'number')
            return [key, createSpring]
          return [key, val]
        }),
      )
      return springedObject(modifiedObject) as Springed<UnSpringObject<T>>
    },
    target: input,
    computeValue(state, springCache) {
      const newState: SpringedObjectState = {}
      const value = Object.fromEntries(
        Object.entries(input).map(([key, val]: [string, unknown]) => {
          if (!isSpringed(val)) return [key, val]
          const result = computeSpring(
            val as Springed<unknown>,
            state[key] || val.getInitialState(springCache),
            springCache,
          )
          newState[key] = result.state
          return [key, result.value]
        }),
      ) as UnSpringObject<T>
      return { state: newState, value }
    },
    type: SpringType.other,
    getInitialState: () => ({}),
  }
  return spring
}

const computeSpring = <T extends any = unknown, S = any>(
  spring: Springed<T, S>,
  state: S,
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
      const propsSpring = springedObject(Object.fromEntries(
        propsEntries.filter(([, val]) => isSpringed(val)),
      ) as typeof props)
      const elementRef = useRef<Element | undefined>()
      const propsStateRef = useRef<unknown>(
        propsSpring.getInitialState(new Map()),
      )
      useEffect(() => {
        const updateComponentSprings = () => {
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
          }
          timeoutId = setTimeout(
            () => (rafId = requestAnimationFrame(updateComponentSprings)),
            1,
          ) as any
        }
        let rafId = requestAnimationFrame(updateComponentSprings)
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
  const [targetRed = 0, targetGreen = 0, targetBlue = 0, targetAlpha = 1] =
    (targetColor && targetColor.match(colorRegex)) || []
  const red = spring(Number(targetRed))
  const green = spring(Number(targetGreen))
  const blue = spring(Number(targetBlue))
  const alpha = spring(Number(targetAlpha))

  return {
    [springed]: true,
    subSprings: { red, green, blue, alpha },
    composeTweenedValues: ({ red, green, blue, alpha }) =>
      `rgba(${red},${green},${blue},${alpha})`,
  }
}

export const tweenLength = (
  spring: CreateSpring,
  targetVal: string,
  measure: (el: HTMLElement) => number,
): Springed<string> => {
  let v: number
  return {
    [springed]: true,
    targetVal,
    measure: el => (v = measure(el)),
    subSprings: { v: spring(v || 0) },
    composeTweenedValues: ({ v }) => v,
  }
}
