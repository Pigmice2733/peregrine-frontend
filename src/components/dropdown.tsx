import { css } from 'linaria'
import { h, JSX } from 'preact'
import clsx from 'clsx'
import { createShadow } from '@/utils/create-shadow'
import { SetRequired } from 'type-fest'

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

interface BaseProps<T> {
  class?: string
  button?: true
  options: readonly T[]
  value?: T
  onChange: (v: T) => void
  getGroup?: (v: T) => string | null
  getKey?: (v: T) => string | number
  getText?: (v: T) => string | number
}

type Props<T> = BaseProps<T> &
  (T extends object ? SetRequired<BaseProps<T>, 'getKey' | 'getText'> : {})

export const Dropdown = <T extends any>({
  options,
  button,
  onChange,
  value,
  getKey = (v: T) => v,
  getText = (v: T) => v,
  getGroup = () => null,
  ...props
}: Props<T>) => {
  const optionsByGroup = options.reduce((acc, opt) => {
    const group = getGroup(opt) || ''
    acc[group] = (acc[group] || []).concat(
      <option value={getKey(opt)} key={getKey(opt)}>
        {getText(opt)}
      </option>,
    )
    return acc
  }, {} as { [key: string]: JSX.Element[] })
  console.log(optionsByGroup)
  const groups = new Set(options.map(o => getGroup(o)).filter(g => g !== null))
  console.log(groups)
  return (
    // eslint-disable-next-line caleb/jsx-a11y/no-onchange
    <select
      value={value === undefined ? undefined : getKey(value)}
      onChange={e =>
        onChange(
          options.find(
            o => getKey(o).toString() === (e.target as HTMLSelectElement).value,
          ) as T,
        )
      }
      class={clsx(button && buttonStyles, props.class, dropdownStyle)}
    >
      {Object.entries(optionsByGroup).map(([groupName, children]) =>
        groupName ? (
          <optgroup label={groupName}>{children}</optgroup>
        ) : (
          children
        ),
      )}
    </select>
  )
}
