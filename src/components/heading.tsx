import { css } from '@linaria/core'
import { pigmicePurple } from '@/colors'
import clsx from 'clsx'

type level = 1 | 2 | 3 | 4 | 5 | 6

interface Props extends JSX.HTMLAttributes<HTMLHeadingElement> {
  level: level
}

const headingStyle = css`
  margin: 0;
  border-bottom: 0.13rem solid ${pigmicePurple};
  padding: 0 1rem 0.25rem;
`

export const Heading = ({ level, ...props }: Props) => {
  const Element = `h${level}` as const
  return <Element {...props} class={clsx(headingStyle, props.class)} />
}
