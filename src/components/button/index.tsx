import { h } from 'preact'
import style from './style.css'

const Button = (props: JSX.HTMLAttributes) => {
  const El = props.href ? 'a' : 'button'
  return <El {...props} class={`${style.button} ${props.class || ''}`} />
}

export default Button
