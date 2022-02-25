import { h, JSX, ComponentChildren } from 'preact'
import { css } from 'linaria'
import { Merge } from '@/type-utils'
import { useRef } from 'preact/hooks'
import clsx from 'clsx'

const formStyles = css`
  width: 100%;
  display: grid;
  grid-gap: 1.6rem;
`

type Props = Merge<
  JSX.HTMLAttributes,
  { children: (isValid: boolean) => ComponentChildren }
>

export const Form = (props: Props) => {
  const formRef = useRef<HTMLFormElement>()
  // eslint-disable-next-line caleb/@typescript-eslint/no-unnecessary-condition
  const isValid = Boolean(formRef?.current.checkValidity())
  return (
    <form {...props} class={clsx(props.class, formStyles)} ref={formRef}>
      {props.children(isValid)}
    </form>
  )
}
