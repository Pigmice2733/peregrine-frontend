import { h, JSX } from 'preact'
import { css } from 'linaria'
import { pigmicePurple } from '@/colors'
import clsx from 'clsx'

type level = 1 | 2 | 3 | 4 | 5 | 6

interface Props extends JSX.HTMLAttributes {
  level: level
}

const headingStyle = css`
  margin: 0;
  border-bottom: 0.13rem solid ${pigmicePurple};
  padding-bottom: 0.25rem;
`

export const Heading = ({ level, ...props }: Props) => {
  const Element = 'h' + level
  return <Element {...props} class={clsx(headingStyle, props.class)}></Element>
}
