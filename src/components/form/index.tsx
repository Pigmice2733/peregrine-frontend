import { h, JSX, ComponentChildren } from 'preact'
import { css } from 'linaria'
import { Merge } from '@/type-utils'
import { useRef } from 'preact/hooks'
import clsx from 'clsx'

const formStyles = css`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`

type Props = Merge<
  JSX.HTMLAttributes,
  { children: (isValid: boolean) => ComponentChildren }
>

export const Form = (props: Props) => {
  const formRef = useRef<HTMLFormElement>()
  const isValid = Boolean(formRef.current && formRef.current.checkValidity())
  return (
    <form {...props} class={clsx(props.class, formStyles)} ref={formRef}>
      {props.children(isValid)}
    </form>
  )
}
