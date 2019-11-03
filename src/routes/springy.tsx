import { h, FunctionComponent } from 'preact'
import { initSpring, Animated } from '@/spring/use'
import { useState } from 'preact/hooks'
import { css } from 'linaria'

const wrapperStyle = css`
  width: 100%;
  height: 100vh;
  overflow: hidden;
`

const width = 50

const boxStyle = css`
  width: ${width}px;
  height: ${width}px;
  background: purple;
  will-change: transform;
  border-radius: 10%;

  &::before {
    content: '';
    display: block;
    width: ${width / 4}px;
    height: ${width / 4}px;
    border-radius: 50%;
    background: red;
    margin: 0 auto;
    transform: translateY(${width / 15}px);
  }
`

const Springy: FunctionComponent = () => {
  const spring = initSpring({
    friction: 0.007,
    mass: 0.0023,
    springStrength: 0.02,
  })
  const [x, setX] = useState(0)
  const [y, setY] = useState(0)
  const targetX = x - width / 2
  const targetY = y - width / 2
  const offsetX = spring(targetX)
  const offsetY = spring(targetY)
  const angle = spring(getValue => {
    const currentX = getValue(offsetX)
    const currentY = getValue(offsetY)
    console.log(Math.atan((targetY - currentY) / (targetX - currentX)))
    // Rise over run
    return Math.atan((targetY - currentY) / (targetX - currentX)) - Math.PI / 2
  })

  return (
    // eslint-disable-next-line caleb/jsx-a11y/no-static-element-interactions, caleb/jsx-a11y/click-events-have-key-events
    <div
      class={wrapperStyle}
      onClick={(e: MouseEvent) => {
        setX(e.x)
        setY(e.y)
      }}
    >
      <Animated.div
        class={boxStyle}
        style={spring({
          transform: spring`translate(${offsetX}px, ${offsetY}px) rotate(${angle}rad)`,
        })}
      />
    </div>
  )
}

export default Springy
