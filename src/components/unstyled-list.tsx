import { css } from '@linaria/core'
import clsx from 'clsx'
import { PropsOf } from 'src/type-utils'

const style = css`
  padding: 0;
  margin: 0;
  list-style-type: none;
`

export const UnstyledList = (props: PropsOf<'ul'>) => {
  return <ul {...props} class={clsx(style, props.class)} />
}
