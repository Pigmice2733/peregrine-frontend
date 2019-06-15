import { h, JSX } from 'preact'
import { Merge } from '@/type-utils'
import clsx from 'clsx'
import { css } from 'linaria'
import { createShadow } from '@/utils/create-shadow'
import { pxToRem } from '@/utils/px-to-rem'

const cardStyle = css`
  border-radius: ${pxToRem(4)};
  box-shadow: ${createShadow(1)};
  background: white;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;

  &[href]:hover,
  &:focus:not(:active),
  &:focus-within:not(:active) {
    box-shadow: ${createShadow(8)};
  }

  &:focus {
    outline: none;
    background: #dfdfdf;
  }
`

type Props = JSX.HTMLAttributes

export type CardProps<T = {}> = Merge<Props, T>

const Card = (props: Props) => {
  const El = props.href ? 'a' : 'div'
  return <El {...props} class={clsx(cardStyle, props.class)} />
}

export default Card
