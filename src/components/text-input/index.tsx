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
  <label class={style.input}>
    {label}
    <input {...rest} />
  </label>
)

export default TextInput
