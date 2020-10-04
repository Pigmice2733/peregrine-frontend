import clsx from 'clsx'
import { css } from 'linaria'
import { offBlack } from '@/colors'
import { Merge } from 'type-fest'

const alertStyle = css`
  font-size: 0.9rem;
  flex-shrink: 1;
  margin: 0.5rem 0;
  padding: 0.5rem;
  border-radius: 0.3rem;
`

const errorAlertStyle = css`
  background: #f8b0b0;
  color: #9b0000;
`

const warningAlertStyle = css`
  background: #ffe082;
  color: ${offBlack};
`

const successAlertStyle = css`
  background: #aed581;
  color: ${offBlack};
`

type AlertProps = Merge<JSX.IntrinsicElements['div'], { type: AlertType }>

export const enum AlertType {
  Success,
  Warning,
  Error,
}

const Alert = ({ type, ...props }: AlertProps) => (
  <div
    {...props}
    class={clsx(
      alertStyle,
      props.class,
      type === AlertType.Warning && warningAlertStyle,
      type === AlertType.Success && successAlertStyle,
      type === AlertType.Error && errorAlertStyle,
    )}
  >
    {props.children}
  </div>
)

export default Alert
