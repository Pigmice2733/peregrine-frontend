import { h, FunctionComponent } from 'preact'
import {
  initSpring,
  Animated,
  templateSpring,
  createDerivedNumberSpring,
} from '@/spring/use'
import { useState } from 'preact/hooks'
import { css } from 'linaria'

const wrapperStyle = css`
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: black;
`

const width = 50

const boxStyle = css`
  position: absolute;
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
    friction: 0.01,
    mass: 0.003,
    springStrength: 0.02,
  })
  const heavySpring = initSpring({
    friction: 0.013,
    mass: 0.007,
    springStrength: 0.02,
  })
  const [x, setX] = useState(0)
  const [y, setY] = useState(0)
  const targetX = x - width / 2
  const targetY = y - width / 2
  const offsetX = spring(targetX)
  const offsetY = spring(targetY)
  const angle = createDerivedNumberSpring(
    [offsetX, offsetY],
    ([offsetX, offsetY]) =>
      -Math.atan2(offsetY - targetY, targetX - offsetX) + Math.PI / 2,
  )
  const offsetX2 = spring(offsetX)
  const offsetY2 = spring(offsetY)
  const angle2 = createDerivedNumberSpring(
    [offsetX2, offsetY2],
    ([offsetX, offsetY]) =>
      -Math.atan2(offsetY - targetY, targetX - offsetX) + Math.PI / 2,
  )
  const offsetX3 = spring(offsetX2)
  const offsetY3 = spring(offsetY2)
  const angle3 = createDerivedNumberSpring(
    [offsetX3, offsetY3],
    ([offsetX, offsetY]) =>
      -Math.atan2(offsetY - targetY, targetX - offsetX) + Math.PI / 2,
  )

  return (
    // eslint-disable-next-line caleb/jsx-a11y/no-static-element-interactions, caleb/jsx-a11y/click-events-have-key-events
    <div
      class={wrapperStyle}
      onMouseMove={(e: MouseEvent) => {
        setX(e.x)
        setY(e.y)
      }}
      // onClick={(e: MouseEvent) => {
      //   setX(e.x)
      //   setY(e.y)
      // }}
    >
      <Animated.div
        class={boxStyle}
        style={templateSpring`transform: translate(${offsetX}px, ${offsetY}px) rotate(${spring(
          angle,
        )}rad)`}
      />
      {/* <Animated.div
        class={boxStyle}
        data-asdf={JSON.stringify(angle)}
        style={templateSpring`transform: translate(${angle}px, ${0}px) rotate(${0}rad)`}
      /> */}
      <Animated.div
        class={boxStyle}
        style={templateSpring`transform: translate(${offsetX2}px, ${offsetY2}px) rotate(${spring(
          angle2,
        )}rad)`}
      />
      <Animated.div
        class={boxStyle}
        style={templateSpring`transform: translate(${offsetX3}px, ${offsetY3}px) rotate(${spring(
          angle3,
        )}rad)`}
      />
    </div>
  )
}

export default Springy
