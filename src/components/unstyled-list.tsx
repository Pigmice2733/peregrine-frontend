import { css } from 'linaria'
import clsx from 'clsx'
import { PropsOf } from '@/type-utils'

const style = css`
  padding: 0;
  margin: 0;
  list-style-type: none;
`

export const UnstyledList = (props: PropsOf<'ul'>) => {
  return <ul {...props} class={clsx(style, props.class)} />
}
