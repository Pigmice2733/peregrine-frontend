import { css } from 'linaria'

const outer = css`
  border-radius: 0.3rem;
  display: flex;
  font-size: 0.8rem;
  background: #00000011;
  flex-direction: row;
  overflow: hidden;

  &:focus-within,
  &:active {
    box-shadow: 0 0 0px 4px var(--focus-ring);
  }
`

const label = css`
  cursor: pointer;
  display: flex;
`

const text = css`
  padding: 0.5rem;
  text-align: center;
  display: flex;
  align-items: center;
`

const input = css`
  position: absolute;
  clip: rect(1px, 1px, 1px, 1px);

  &:checked + div {
    background: rgba(0, 0, 0, 0.2);
  }
`

interface Props<T extends string> {
  name: string
  items: T[]
  onChange: (newVal: T) => void
  selected?: T
}

const EnumSelector = <T extends string>({
  name,
  items,
  onChange,
  selected,
}: Props<T>) => (
  <div class={outer}>
    {items.map((i) => (
      <label class={label} key={i}>
        <input
          class={input}
          type="radio"
          name={name}
          value={i}
          checked={i === selected}
          onChange={() => onChange(i)}
        />
        <div class={text}>{i}</div>
      </label>
    ))}
  </div>
)

export default EnumSelector
