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

const outlinedCardStyle = css`
  box-shadow: 0 0 0 0.1rem #99999973;
`

interface BaseCardProps {
  outlined?: boolean
}

interface Card {
  // Specific common overloads so that event listener types can be inferred
  (props: { as: 'div' } & PropsOf<'div'> & BaseCardProps): VNode
  (props: { as: 'a' } & PropsOf<'a'> & BaseCardProps): VNode
  // Generic overload for any "as" type, event listener types must manually be specified, but they will be checked
  <T extends ElementName>(props: { as: T } & PropsOf<T> & BaseCardProps): VNode
  // Overloads for when there is no `as` prop
  (props: PropsOf<'a'> & { href: string } & BaseCardProps): VNode
  (props: PropsOf<'div'> & BaseCardProps): VNode
  <T extends (props: any, context?: any) => VNode>(
    props: { as: T } & PropsOf<T> & BaseCardProps,
  ): VNode
}

const Card: Card = ({
  as,
  outlined,
  ...props
}: {
  as?: ComponentName
  href?: string
  class?: string
} & BaseCardProps) => {
  const El = as || (props.href ? 'a' : 'div')
  return (
    <El
      {...props}
      class={clsx(cardStyle, outlined && outlinedCardStyle, props.class)}
    />
  )
}

export default Card
