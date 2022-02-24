import { h, FunctionComponent } from 'preact'
import { useState } from 'preact/hooks'
import { css } from 'linaria'

const wrapperStyle = css`
  width: 100%;
  height: 100vh;
  overflow: hidden;
`

const width = 50

const circleStyle = css`
  width: ${width}px;
  height: ${width}px;
  background: purple;
  will-change: transform;
  border-radius: 50%;
  transition: all 0.8s cubic-bezier(0.28, 0.04, 0.6, 1.21);
`

const Springy: FunctionComponent = () => {
  const [x, setX] = useState(0)
  const [y, setY] = useState(0)
  const offsetX = x - width / 2
  const offsetY = y - width / 2
  return (
    <div
      class={wrapperStyle}
      onClick={(e: MouseEvent) => {
        setX(e.x)
        setY(e.y)
      }}
    >
      <div
        class={circleStyle}
        style={`transform: translate(${offsetX}px, ${offsetY}px)`}
      />
    </div>
  )
}

export default Springy
