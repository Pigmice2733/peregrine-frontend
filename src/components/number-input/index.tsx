import { h, JSX } from 'preact'
import { Merge } from '@/type-utils'
import style from './style.css'
import { InnerTextInput } from '../text-input'

type Props = Merge<
  JSX.HTMLAttributes,
  {
    onChange: (newVal: number) => void
    value: number
    min?: number
    max?: number
  }
>

const NumberInput = ({ onChange, value, ...rest }: Props) => {
  const { min, max } = rest
  if (min !== undefined && value < min) {
    onChange(min)
  } else if (max !== undefined && value > max) {
    onChange(max)
  }
  return (
    <div class={style.numberInput}>
      <button
        tabIndex={-1}
        onClick={e => {
          e.preventDefault()
          onChange(value - 1)
        }}
      >
        -
      </button>
      <InnerTextInput
        {...rest}
        value={value}
        type="number"
        onChange={e => onChange((e.target as HTMLInputElement).valueAsNumber)}
      />
      <button
        tabIndex={-1}
        onClick={e => {
          e.preventDefault()
          onChange(value + 1)
        }}
      >
        +
      </button>
    </div>
  )
}

export default NumberInput
