import { h, JSX } from 'preact'
import style from './style.css'
import { Merge } from '@/type-utils'
import clsx from 'clsx'

export type CardProps<T = {}> = Merge<JSX.HTMLAttributes, T>

const Card = (props: JSX.HTMLAttributes) => {
  const El = props.href ? 'a' : 'div'
  return <El {...props} class={clsx(style.card, props.class)} />
}

export default Card
