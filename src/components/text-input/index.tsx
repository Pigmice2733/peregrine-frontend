import { h, JSX } from 'preact'
import { Merge } from '@/type-utils'
import { css } from 'linaria'
import { styled } from 'linaria-styled-preact'
import clsx from 'clsx'

export const InnerTextInput = styled.input`
  padding: 0.2rem 0;
  font-size: 1.1rem;
  display: block;
  width: 100%;
  border: 0;
  border-bottom: 0.13rem solid rgba(0, 0, 0, 0.3);
  border-radius: 0;
  transition: border-bottom-color 0.2s ease;
  background: transparent;

  &:focus {
    border-bottom-color: var(--pigmice-purple);
    outline: none;
  }

  &:invalid {
    border-bottom-color: red;
    box-shadow: none;
  }
`

const labeledInputClass = css`
  margin: 0.8rem 0;
  background: transparent;
  font-size: 0.85rem;
  color: #666;

  & input {
    max-width: 100%;
  }
`

type Props = Merge<JSX.HTMLAttributes, { label: string; labelClass?: string }>

const TextInput = ({ label, labelClass, ...rest }: Props) => {
  return (
    <label class={clsx(labeledInputClass, labelClass)}>
      {label}
      <InnerTextInput {...rest} />
    </label>
  )
}

export default TextInput
