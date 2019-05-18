import { h, JSX } from 'preact'
import style from './style.css'
import clsx from 'clsx'

const Alert = (props: JSX.IntrinsicElements['div']) => (
  <div {...props} class={clsx(style.alert, props.class)}>
    {props.children}
  </div>
)

export default Alert
