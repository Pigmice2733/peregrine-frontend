import { css } from 'linaria'
import { h } from 'preact'
import clsx from 'clsx'

const dropdownStyle = css`
  background: transparent;
  border: none;
  font-size: 0.8rem;
  color: var(--off-black);
  font-weight: bold;
  height: 100%;
  width: 100%;

  & option {
    text-transform: none;
  }
`

export const Dropdown = <T extends any>({
  options,
  onChange,
  getKey = (v: T) => (v as unknown) as string,
  getText = (v: T) => (v as unknown) as string,
  ...props
}: {
  class?: string
  options: T[]
  onChange: (v: T) => void
  getKey?: (v: T) => string | number
  getText?: (v: T) => string
} & (T extends string
  ? {}
  : { getKey: (v: T) => string | number; getText: (v: T) => string })) => (
  // eslint-disable-next-line caleb/jsx-a11y/no-onchange
  <select
    onChange={e =>
      onChange(options.find(
        o => getKey(o).toString() === (e.target as HTMLSelectElement).value,
      ) as T)
    }
    class={clsx(props.class, dropdownStyle)}
  >
    {options.map(o => (
      <option value={getKey(o)} key={getKey(o)}>
        {getText(o)}
      </option>
    ))}
  </select>
)
