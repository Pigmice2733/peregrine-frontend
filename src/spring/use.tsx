import { JSX, FunctionComponent, h } from 'preact'
import { useRef, useEffect } from 'preact/hooks'

const springed = Symbol('springed')

interface SpringState {
  lastTime: number
  velocity: number
  position: number
}

interface SubSprings<T = any> {
  [key: string]: Springed<T>
}

type _Springed<T> = T extends number
  ? {
      [springed]: true
      opts: SpringOpts
      target: number
      state?: SpringState
    }
  : {
      [springed]: true
      measure?: (endEl: HTMLElement) => void
      subSprings: T extends string ? SubSprings<string | number> : SubSprings
      composeTweenedValues: (tweenedValues: { [key: string]: number }) => T
    }

// Mapped types cause TS to not resolve the types inline when you hover over them.
// So this is a useless mapped type that is only being used so that it doesn't get inlined when you hover over it
export type Springed<T> = {
  [K in keyof _Springed<T>]: _Springed<T>[K]
}

interface SpringOpts {
  mass: number
  springStrength: number
  friction: number
}

type UnSpring<T> = T extends Springed<infer U>
  ? U extends object
    ? UnSpringObject<U>
    : U
  : T

// This is a conditional type so that TS will inline the result of the type when you hover over it.
// If it isn't conditional, it doesn't inline it. IDK why.
type UnSpringObject<T extends object> = T extends object
  ? {
      [K in keyof T]: UnSpring<T[K]>
    }
  : never

type ComputeFromSubSprings<T> = (
  getValue: <U extends Springed<any>>(input: U) => UnSpring<U>,
) => T

interface CreateSpring {
  (value: number): Springed<number>
  <T>(computeFromDependentSprings: ComputeFromSubSprings<T>): Springed<T>
  <T extends object>(value: T): Springed<UnSpringObject<T>>
  (
    strings: TemplateStringsArray,
    ...expressions: (number | Springed<number>)[]
  ): Springed<string>
}

const isTemplateStringsArray = (input: any): input is TemplateStringsArray =>
  Array.isArray(input) && Array.isArray((input as any).raw)

export const initSpring = ({
  friction = 0.007,
  mass = 0.0003,
  springStrength = 0.08,
}: Partial<SpringOpts> = {}) => {
  const createSpring: CreateSpring = (
    input:
      | TemplateStringsArray
      | number
      | object
      | ComputeFromSubSprings<unknown>,
    ...expressions: (number | Springed<number>)[] // Only exists when being used as a template string
  ): any => {
    if (typeof input === 'number') {
      // Use case: spring(asdf ? 1 : 2)
      // Returns a direct spring holding the config values
      const resultSpringed: Springed<number> = {
        [springed]: true,
        opts: {
          friction,
          mass,
          springStrength,
        },
        target: input,
      }
      return resultSpringed
    }
    if (isTemplateStringsArray(input)) {
      // Use case: spring`transform: translate${asdf ? 1 : 2}`
      // Returns a composed spring with all of the interpolations being springed
      // The interpolations are keyed by index, because they are fixed order
      const resultSpringed: Springed<string> = {
        [springed]: true,
        subSprings: expressions.reduce<SubSprings<string | number>>(
          (subSprings, expr, i) => {
            subSprings[i] = isSpringed(expr) ? expr : createSpring(expr)
            return subSprings
          },
          {},
        ),
        composeTweenedValues: tweenedValues =>
          input.reduce(
            (builtString, stringChunk, i) =>
              builtString + stringChunk + (tweenedValues[i] || ''),
            '',
          ),
      }
      return resultSpringed
    }
    if (typeof input === 'function') {
      const lastSprings: Springed<any>[] = []
      const resultSpringed: Springed<unknown> = {
        [springed]: true,
        subSprings: {},
        composeTweenedValues() {
          let i = 0
          return input(s => {
            if (lastSprings[i]) copySpringState(lastSprings[i], s)
            lastSprings[i] = s
            i++
            return computeSpring(s)
          })
        },
      }
      return resultSpringed
    }
    // Use case: spring({foo: true, bar: spring(asdf ? 1 : 2)})
    // Returns a composed spring with whichever properties are springed as sub springs
    // They are keyed by object key
    const resultSpringed: Springed<object> = {
      [springed]: true,
      subSprings: Object.entries(input).reduce<SubSprings>(
        (subSprings, [key, value]) => {
          if (isSpringed(value)) subSprings[key] = value
          return subSprings
        },
        {},
      ),
      composeTweenedValues: tweenedValues =>
        Object.entries(input).reduce((acc, [key, val]) => {
          // @ts-ignore
          acc[key] = isSpringed(val) ? tweenedValues[key] : input[key]
          return acc
        }, {}),
    }
    return resultSpringed
  }
  return createSpring
}

const getSpringFramePosition = (spring: Springed<number>) => {
  const currentTime = Date.now()
  const state: SpringState = spring.state || {
    position: spring.target,
    lastTime: currentTime,
    velocity: 0,
  }
  spring.state = state
  const displacement = spring.target - state.position
  const springForce = spring.opts.springStrength * displacement
  // Friction isn't really proportional to velocity
  // But this makes it "feel" right
  // And it makes everything way easier to tune
  const frictionalForce = spring.opts.friction * state.velocity
  const force = springForce - frictionalForce
  // f = ma
  const acceleration = force / spring.opts.mass
  const dTime = (currentTime - state.lastTime) / 1000
  state.lastTime = currentTime
  // v' = v + at
  state.velocity += acceleration * dTime
  // x' = x + vt
  state.position += state.velocity * dTime
  return state.position
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

const isSpringedNumber = (
  spring: Springed<unknown>,
): spring is Springed<number> =>
  (spring as Springed<number>).target !== undefined

const computeSpring = <T extends Springed<unknown>>(spring: T): UnSpring<T> => {
  if (isSpringedNumber(spring)) {
    return getSpringFramePosition(spring) as UnSpring<T>
  }
  return spring.composeTweenedValues(
    Object.entries(spring.subSprings).reduce(
      (acc, [key, value]) => {
        acc[key] = isSpringed(value) ? computeSpring(value) : value
        return acc
      },
      {} as { [key: string]: any },
    ),
  ) as UnSpring<T>
}

const copySpringState = <T extends unknown>(
  oldSpring: Springed<T>,
  newSpring: Springed<T>,
) => {
  if (isSpringedNumber(oldSpring)) {
    if (isSpringedNumber(newSpring)) {
      newSpring.state = oldSpring.state
    }
  } else {
    const subSpringKeys = Object.keys(newSpring.subSprings)
    for (const key of subSpringKeys) {
      const oldSubSpring = oldSpring.subSprings[key]
      const newSubSpring = newSpring.subSprings[key]
      if (oldSubSpring) copySpringState(oldSubSpring, newSubSpring)
    }
  }
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
      const lastSpring = useRef<Springed<any> | null>(null)
      const propsEntries = Object.entries(props)
      const staticProps = Object.fromEntries(
        propsEntries.filter(([, val]) => !isSpringed(val)),
      )
      const propsSpring = initSpring()(
        Object.fromEntries(propsEntries.filter(([, val]) => isSpringed(val))),
      )
      if (lastSpring.current) copySpringState(lastSpring.current, propsSpring)
      lastSpring.current = propsSpring
      const elementRef = useRef<Element | undefined>()
      useEffect(() => {
        const updateComponentSprings = () => {
          const element = elementRef.current
          const tweenedProps = computeSpring(propsSpring)
          if (element) {
            if (typeof tweenedProps.style === 'string') {
              ;(element as HTMLElement).style.cssText = tweenedProps.style
            } else {
              for (const key in tweenedProps.style) {
                ;(element as HTMLElement).style[key] = tweenedProps.style[key]
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
      }, [propsSpring])
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
