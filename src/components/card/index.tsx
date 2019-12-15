import { h, VNode } from 'preact'
import { ComponentName, PropsOf, ElementName } from '@/type-utils'
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

interface Card {
  // Specific common overloads so that event listener types can be inferred
  (props: { as: 'div' } & PropsOf<'div'>): VNode
  (props: { as: 'a' } & PropsOf<'a'>): VNode
  // Generic overload for any "as" type, event listener types must manually be specified, but they will be checked
  <T extends ElementName>(props: { as: T } & PropsOf<T>): VNode
  // Overloads for when there is no `as` prop
  (props: PropsOf<'a'> & { href: string }): VNode
  (props: PropsOf<'div'>): VNode
  <T extends (props: any, context?: any) => VNode>(
    props: { as: T } & PropsOf<T>,
  ): VNode
}

const Card: Card = ({
  as,
  ...props
}: { as?: ComponentName; href?: string; class?: string } & unknown) => {
  const El = as || (props.href ? 'a' : 'div')
  return <El {...props} class={clsx(cardStyle, props.class)} />
}

export default Card
