import { css } from 'linaria'
import { greenOnPurple, redOnPurple, focusRing } from '@/colors'
import { FunctionComponent, JSX } from 'preact'
import { Merge } from 'type-fest'
import clsx from 'clsx'
import Icon from './icon'
import { checkBold } from '@/icons/check-bold'
import { xBold } from '@/icons/x-bold'

const trueStyle = css`
  background: ${greenOnPurple};
`

const falseStyle = css`
  background: ${redOnPurple};
`

export const BooleanDisplay: FunctionComponent<Merge<
  JSX.HTMLAttributes,
  { value: boolean }
>> = ({ value, ...props }) => {
  const El = props.onClick ? 'button' : 'div'
  return (
    <El
      {...props}
      class={clsx(
        booleanDisplayStyle,
        value ? trueStyle : falseStyle,
        props.class,
      )}
    >
      <Icon icon={value ? checkBold : xBold} />
    </El>
  )
}

const booleanDisplayStyle = css`
  width: 1.3rem;
  height: 1.3rem;
  border-radius: 50%;
  border: none;
  outline: none;
  color: white;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  padding: 0.25rem;

  button& {
    cursor: pointer;
  }

  &:focus {
    box-shadow: 0 0 0 0.25rem ${focusRing};
  }
`
