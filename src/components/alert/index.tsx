import { h, JSX } from 'preact'
import clsx from 'clsx'
import { css } from 'linaria'
import { offBlack } from '@/colors'

const alertStyle = css`
  background: #f8b0b0;
  color: #9b0000;
  font-size: 0.9rem;
  flex-shrink: 1;
  margin: 0.5rem 0;
  padding: 0.5rem;
  border-radius: 0.3rem;
`

const warningAlertStyle = css`
  background: #ffe082;
  color: ${offBlack};
`

const successAlertStyle = css`
  background: #aed581;
  color: ${offBlack};
`

type AlertProps = JSX.IntrinsicElements['div'] & {
  warning?: boolean
  success?: boolean
}

const Alert = ({ warning, success, ...props }: AlertProps) => (
  <div
    {...props}
    class={clsx(
      alertStyle,
      props.class,
      warning && warningAlertStyle,
      success && successAlertStyle,
    )}
  >
    {props.children}
  </div>
)

export default Alert
