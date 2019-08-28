import { JSX, FunctionComponent, h } from 'preact'
import { useRef, useEffect } from 'preact/hooks'

const springed = Symbol('springed')

interface SpringState {
  lastTime: number
  velocity: number
  position: number
}

interface DirectSpring {
  [springed]: true
  opts: Required<SpringOpts>
  target: number
  state?: SpringState
}

interface ComposedSpring<ResultType> {
  [springed]: true
  subSprings: SubSprings
  composeTweenedValues: (tweenedValues: { [key: string]: number }) => ResultType
}

type Springed<ResultType> = DirectSpring | ComposedSpring<ResultType>

interface SpringOpts {
  mass?: number
  springStrength?: number
  friction?: number
}

interface CreateSpring {
  (strings: TemplateStringsArray, ...expressions: number[]): ComposedSpring<
    string
  >
  (value: number): DirectSpring
  <T>(value: T): ComposedSpring<T>
}

interface SubSprings {
  [key: string]: Springed<any>
}

const isTemplateStringsArray = (input: any): input is TemplateStringsArray =>
  Array.isArray(input) && Array.isArray((input as any).raw)

export const initSpring = ({
  friction = 0.007,
  mass = 0.0003,
  springStrength = 0.08,
}: SpringOpts = {}) => {
  const createSpring: CreateSpring = <T extends {}>(
    firstArg: number | TemplateStringsArray | T,
    ...expressions: number[]
  ): any => {
    if (typeof firstArg === 'number') {
      const resultSpringed: DirectSpring = {
        [springed]: true,
        opts: {
          friction,
          mass,
          springStrength,
        },
        target: firstArg,
      }
      return resultSpringed
    }
    if (isTemplateStringsArray(firstArg)) {
      const resultSpringed: ComposedSpring<string> = {
        [springed]: true,
        subSprings: expressions.reduce<SubSprings>((subSprings, expr, i) => {
          subSprings[i] = createSpring(expr)
          return subSprings
        }, {}),
        composeTweenedValues: tweenedValues =>
          firstArg.reduce(
            (builtString, stringChunk, i) =>
              builtString + stringChunk + (tweenedValues[i] || ''),
            '',
          ),
      }
      return resultSpringed
    }
    const resultSpringed: ComposedSpring<T> = {
      [springed]: true,
      subSprings: Object.entries(firstArg).reduce<SubSprings>(
        (subSprings, [key, value]) => {
          if (isSpringed(value)) subSprings[key] = value
          return subSprings
        },
        {},
      ),
      composeTweenedValues: tweenedValues =>
        Object.entries(firstArg).reduce(
          (acc, [key, val]) => {
            // @ts-ignore
            acc[key] = isSpringed(val) ? tweenedValues[key] : firstArg[key]
            return acc
          },
          {} as T,
        ),
    }
    return resultSpringed
  }
  return createSpring
}

const getSpringFramePosition = (spring: DirectSpring) => {
  const currentTime = new Date().getTime()
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

const isComposedSpring = <T extends any>(
  spring: Springed<T>,
): spring is ComposedSpring<T> =>
  (spring as ComposedSpring<T>).subSprings !== undefined

const isDirectSpring = (spring: Springed<any>): spring is DirectSpring =>
  (spring as DirectSpring).target !== undefined

const computeSpring = <T extends any>(spring: Springed<T>): T => {
  if (isComposedSpring(spring)) {
    return spring.composeTweenedValues(
      Object.entries(spring.subSprings).reduce(
        (acc, [key, value]) => {
          acc[key] = isSpringed(value) ? computeSpring(value) : value
          return acc
        },
        {} as { [key: string]: any },
      ),
    )
  }
  return (getSpringFramePosition(spring) as unknown) as T
}

const copySpringState = <T extends any>(
  oldSpring: Springed<T>,
  newSpring: Springed<T>,
) => {
  if (isDirectSpring(oldSpring)) {
    if (isDirectSpring(newSpring)) {
      newSpring.state = oldSpring.state
    }
  } else if (isComposedSpring(newSpring)) {
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
      const staticProps = Object.fromEntries(
        Object.entries(props).filter(([, val]) => !isSpringed(val)),
      )
      const propsSpring = initSpring()(
        Object.fromEntries(
          Object.entries(props).filter(([, val]) => isSpringed(val)),
        ),
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
