import { VNode } from 'preact'
import { PropsOf, ElementName } from '@/type-utils'
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
  transition: box-shadow 0.3s ease, background 0.3s ease;

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

const outlinedCardStyle = css`
  box-shadow: 0 0 0 0.1rem #99999973;

  &[href]:hover,
  &:focus:not(:active),
  &:focus-within:not(:active) {
    box-shadow: 0 0 0 0.1rem #33333373;
    background-color: #08080814;
  }
`

interface BaseCardProps {
  outlined?: boolean
}

export type CardProps<Elements extends ElementName = ElementName> = {
  [El in Elements]: El extends 'div'
    ? { as?: 'div' } & PropsOf<'div'>
    : El extends 'a'
    ? ({ as: 'a' } | { as?: 'a'; href: string }) & PropsOf<'a'>
    : { as: El } & PropsOf<El>
}[Elements] &
  BaseCardProps

interface Card {
  (props: { href: string } & CardProps<'a'>): VNode
  (props: CardProps<'div'>): VNode
  (props: CardProps): VNode
}

const Card: Card = ({ as, outlined, ...props }: CardProps) => {
  const El = as || (props.href ? 'a' : 'div')
  return (
    <El
      {...(props as any)}
      class={clsx(cardStyle, outlined && outlinedCardStyle, props.class)}
    />
  )
}

export default Card
