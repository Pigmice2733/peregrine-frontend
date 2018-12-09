import { h } from 'preact'
import style from './style.css'
import { Merge } from '@/type-utils'

type Props = Merge<
  JSX.HTMLAttributes,
  {
    label: string
  }
>

const TextInput = ({ label, ...rest }: Props) => (
  <label>
    <input {...rest} class={style.input} />
    {label}
  </label>
)

export default TextInput
