import { h, JSX } from 'preact'
import clsx from 'clsx'
import { css } from 'linaria'

const alertStyle = css`
  background: #f8b0b0;
  color: #9b0000;
  font-size: 0.9rem;
  flex-shrink: 1;
  margin: 0.5rem 0;
  padding: 0.5rem;
  border-radius: 0.3rem;
`

const Alert = (props: JSX.IntrinsicElements['div']) => (
  <div {...props} class={clsx(alertStyle, props.class)}>
    {props.children}
  </div>
)

export default Alert
