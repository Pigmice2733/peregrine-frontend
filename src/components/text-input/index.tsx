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
  <div>
    <label>
      <input {...rest} class={style.input} />
      {label}
    </label>
  </div>
)

export default TextInput
