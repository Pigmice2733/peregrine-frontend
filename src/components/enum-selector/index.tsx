import { h } from 'preact'
import style from './style.css'

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
  <div class={style.enumSelector}>
    {items.map(i => (
      <label key={i}>
        <input
          type="radio"
          name={name}
          value={i}
          checked={i === selected}
          onChange={e => onChange(i)}
        />
        <div>{i}</div>
      </label>
    ))}
  </div>
)

export default EnumSelector
