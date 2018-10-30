import { h } from 'preact'
import style from './style.css'
import { Merge } from '@/type-utils'

export type CardProps<T = {}> = Merge<JSX.HTMLAttributes, T>

const Card = (props: JSX.HTMLAttributes) => {
  const El = props.href ? 'a' : 'div'
  return (
    <El {...props} class={`${style.card} ${props.class || ''}`}>
      {props.children}
    </El>
  )
}

export default Card
