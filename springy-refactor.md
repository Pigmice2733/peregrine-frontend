- spring should not have all these overloads, creating super-springs should be separate module exports. They aren't actually related to the individual spring configs so it is silly the way it is currently.

```ts
import { initSpring, templateSpring, templateSpringAll, springedObject } from ''
const spring = initSpring()
const x = spring(foo ? 2 : 1) // Springed<number>
const y = foo ? 2 : 1 // number

// Springed<number> - "spring on a spring"
const foo = spring(x)

// Springed<number> - the result of this is directly tied with the x spring, it is not double springed
const bar = createDerivedSpring([x], ([x]) => {
  return y / x
})

// Springed<number> - This is double springed. The return value of the createDerivedSpring got springed
const asdf = spring(bar)

// Springed<number> - The return value of createDerivedSpring got springed
const foobar = spring(
  createDerivedSpring([x], ([x]) => {
    return x > 10 ? 100 : 35
  }),
)

const color = (r, g, b) =>
  createDerivedSpring([r, g, b].map(spring), ([r, g, b]) => {
    return `rgba(${r}, ${g}, ${b})`
  })

// The "expected result" would be a color that smoothly transitions
// In this case createDerivedSpring(...).compose() will be called
// We _want_ that to wrap all the input springs with the wrapper springs
// But that conflicts with above where the return value got springed.
// We could use typeof on the return value. That might be the best solution
// NO that won't work because we don't have access to the return value in .compose()
// So we'll need two separate methods for creating derived springs. One that is for numbers and one that is not
const respringedColor = spring(
  asdf ? color(235, 220, 130) : color(130, 250, 120),
)

// Spring<{background: 'green', asdf: number}> -- asdf is springed but not background
const css3 = springedObject({
  background: foo ? 'green' : 'blue',
  asdf: spring(foo ? 1 : 2),
})

// Spring<string> - x is single springed, y is not springed
const css = templateSpring`transform: translateX(${x}px) translateY(${y}px)`

// Spring<string> - both x and y are springed. x is double springed, y is only springed once
const css2 = spring(
  templateSpring`transform: translateX(${x}px) translateY(${y}px)`,
)
```

```ts
interface Spring<T> {
  [springed]: true
  computeValue(state: any): T
  compose(outerSpring: CreateSpring): Spring<T>
}
```

- Where should spring state be stored - in Animated is best.

```ts
const Animated = () => {
  setInterval(() => {
    // springsCache holds values for ONE FRAME so that they do not get computed multiple times
    // The values are the resolved/computed values from the springs
    const springsCache = Map<Springed<T>, T>
    // compute root props spring
    // All sub springs when they get computed, get added to springsCache
  })
}
```

- What happens if I pass a springed value down into a regular component?

Each component (each element, even) has its own frame loop, so it wouldn't be good (/accurate) if they shared the same cache
_unless_ we have a global frame loop - think about this more in the future
a global thing that Animated components can register themselves into

```tsx
const A = () => {
  const spring = initSpring()
  const x = spring(foo ? 1 : 2)
  return (
    <Fragment>
      <Animated.div style={springedObject({ x })} />
      <B x={x}>
    </Fragment>
  )
}

const B = ({x}) => {
  // x is Springed<number>
  return <Animated.div style={springedObject({y: x}} />
}
```

- "measuring" oof

```tsx
const A = () => {
  const spring = initSpring()
  const width = spring(foo ? '50%' : 'auto', (el: HTMLElement) => el.innerWidth)

  return <Animated.div style={templateSpring`width: ${width}`} />
}
```
