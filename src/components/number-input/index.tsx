import { Merge } from '@/type-utils'
import { InnerTextInput } from '../text-input'
import { css } from 'linaria'

type Props = Merge<
  JSX.HTMLAttributes,
  {
    onChange: (newVal: number) => void
    value: number
    min?: number
    max?: number
  }
>

const numberInputStyle = css`
  display: flex;
  align-items: center;

  & > button {
    --bg: #00000022;
    background: var(--bg);
    border: none;
    border-radius: 9in;
    height: 1.7rem;
    width: 1.7rem;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
    font-size: 1.1rem;
    outline: none;
    cursor: pointer;

    &:first-of-type {
      order: 0;
    }

    &:last-of-type {
      order: 2;
    }

    &:hover {
      background: color-mod(var(--bg) lightness(+30%));
    }

    &:focus {
      box-shadow: 0 0 0 3px var(--focus-ring);
    }
  }

  & > input {
    margin: 0.3rem;
    width: 2rem;
    -moz-appearance: textfield;
    text-align: center;
    order: 1;

    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }
`

const NumberInput = ({ onChange, value, ...rest }: Props) => {
  const { min, max } = rest
  if (min !== undefined && value < min) {
    onChange(min)
  } else if (max !== undefined && value > max) {
    onChange(max)
  }
  return (
    <div class={numberInputStyle}>
      <InnerTextInput
        {...rest}
        value={value}
        type="number"
        onChange={(e) => onChange((e.target as HTMLInputElement).valueAsNumber)}
      />
      <button
        tabIndex={-1}
        onClick={(e) => {
          e.preventDefault()
          onChange(value - 1)
        }}
      >
        -
      </button>
      <button
        tabIndex={-1}
        onClick={(e) => {
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
