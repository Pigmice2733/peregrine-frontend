import { Merge, PropsOf } from '@/type-utils'
import { css } from 'linaria'
import clsx from 'clsx'
import { useState } from 'preact/hooks'

const hasFocusedClass = css``

const innerClass = css`
  padding: 0.2rem 0;
  font-size: 1.1rem;
  display: block;
  width: 100%;
  border: 0;
  border-bottom: 0.13rem solid rgba(0, 0, 0, 0.3);
  border-radius: 0;
  transition: border-bottom-color 0.2s ease;
  background: transparent;
  font-family: inherit;

  &:focus {
    border-bottom-color: var(--pigmice-purple);
    outline: none;
  }

  &${'.' + hasFocusedClass}:invalid {
    border-bottom-color: red;
    box-shadow: none;
  }
`

export const InnerTextInput = (props: PropsOf<'input'>) => {
  const [hasFocused, setHasFocused] = useState(false)
  return (
    <input
      {...props}
      onBlur={(e) => {
        setHasFocused(true)
        if (props.onBlur) props.onBlur.call(e.currentTarget, e)
      }}
      class={clsx(props.class, hasFocused && hasFocusedClass, innerClass)}
    />
  )
}

const labeledInputClass = css`
  background: transparent;
  font-size: 0.85rem;
  color: #666;

  & input {
    max-width: 100%;
  }
`

type Props = Merge<
  JSX.HTMLAttributes,
  { label: string; labelClass?: string; onInput?: (val: string) => void }
>

export { Props as TextInputProps }

const TextInput = ({ label, labelClass, onInput, ...rest }: Props) => {
  return (
    <label class={clsx(labeledInputClass, labelClass)} key="asdfasdf">
      {label}
      <InnerTextInput
        {...rest}
        onInput={(e) => onInput?.((e.target as HTMLInputElement).value)}
      />
    </label>
  )
}

export default TextInput
