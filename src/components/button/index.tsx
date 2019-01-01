import { h } from 'preact'
import style from './style.css'
import clsx from 'clsx'

const Button = (props: JSX.HTMLAttributes) => {
  const El = props.href ? 'a' : 'button'
  return <El {...props} class={clsx(style.button, props.class)} />
}

export default Button
