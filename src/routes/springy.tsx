import { h, FunctionComponent } from 'preact'
import { initSpring, Animated } from '@/spring/use'
import { useState } from 'preact/hooks'
import { css } from 'linaria'

const wrapperStyle = css`
  width: 100%;
  height: 100vh;
`

const width = 50

const circleStyle = css`
  width: ${width}px;
  height: ${width}px;
  background: purple;
  will-change: transform;
  border-radius: 50%;
`

const Springy: FunctionComponent = () => {
  const spring = initSpring({
    friction: 0.007,
    mass: 0.0019,
    springStrength: 0.08,
  })
  const [x, setX] = useState(0)
  const [y, setY] = useState(0)
  return (
    <div
      class={wrapperStyle}
      onClick={(e: MouseEvent) => {
        setX(e.x)
        setY(e.y)
      }}
    >
      <Animated.div
        class={circleStyle}
        style={spring({
          transform: spring`translate(${x - width / 2}px, ${y - width / 2}px)`,
        })}
      ></Animated.div>
    </div>
  )
}

export default Springy
