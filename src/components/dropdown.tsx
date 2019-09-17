import { css } from 'linaria'
import { h } from 'preact'
import clsx from 'clsx'
import { createShadow } from '@/utils/create-shadow'

const dropdownStyle = css`
  background: transparent;
  border: none;
  font-size: 0.8rem;
  color: var(--off-black);
  font-weight: bold;

  & option {
    text-transform: none;
  }
`

const buttonStyles = css`
  background: white;
  padding: 0.6rem 0.7rem;
  border-radius: 0.2rem;
  box-shadow: ${createShadow(2)};
`

type Props<T> = {
  class?: string
  button?: true
  options: readonly T[]
  value?: T
  onChange: (v: T) => void
  getKey?: (v: T) => string | number
  getText?: (v: T) => string
} & (T extends string
  ? {}
  : { getKey: (v: T) => string | number; getText: (v: T) => string })

export const Dropdown = <T extends any>({
  options,
  button,
  onChange,
  value,
  getKey = (v: T) => (v as unknown) as string,
  getText = (v: T) => (v as unknown) as string,
  ...props
}: Props<T>) => {
  return (
    // eslint-disable-next-line caleb/jsx-a11y/no-onchange
    <select
      value={value === undefined ? undefined : getKey(value)}
      onChange={e =>
        onChange(options.find(
          o => getKey(o).toString() === (e.target as HTMLSelectElement).value,
        ) as T)
      }
      class={clsx(button && buttonStyles, props.class, dropdownStyle)}
    >
      {options.map(o => (
        <option value={getKey(o)} key={getKey(o)}>
          {getText(o)}
        </option>
      ))}
    </select>
  )
}
