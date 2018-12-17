import { h } from 'preact'
import style from './style.css'
import { Merge } from '@/type-utils'

type Props = Merge<JSX.HTMLAttributes, { label: string }>

export const InnerTextInput = (props: JSX.HTMLAttributes) => (
  <input {...props} class={style.input} />
)

const TextInput = ({ label, ...rest }: Props) => {
  return (
    <label class={style.labeledInput}>
      {label}
      <InnerTextInput {...rest} />
    </label>
  )
}

export default TextInput
