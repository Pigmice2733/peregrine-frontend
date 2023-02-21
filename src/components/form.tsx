import { ComponentChildren } from 'preact'
import { css } from 'linaria'
import { Merge } from '@/type-utils'
import { MutableRef, useRef } from 'preact/hooks'
import clsx from 'clsx'

const formStyle = css`
  width: 100%;
  display: grid;
  grid-gap: 1.6rem;
`

type Props = Merge<
  JSX.HTMLAttributes,
  { children: (isValid: boolean) => ComponentChildren }
>

export const Form = (props: Props) => {
  const formRef = useRef<HTMLFormElement | null>() as
    | MutableRef<HTMLFormElement>
    | undefined
  const isValid = Boolean(formRef?.current.checkValidity())
  return (
    <form {...props} class={clsx(props.class, formStyle)} ref={formRef}>
      {props.children(isValid)}
    </form>
  )
}
