import { h, JSX } from 'preact'
import { css } from 'linaria'
import clsx from 'clsx'

interface Props extends JSX.HTMLAttributes {
  icon: string
}

const iconStyle = css`
  width: 1.5rem;
  height: 1.5rem;
  fill: currentColor;
`

const Icon = ({ icon, ...props }: Props) => (
  <svg {...props} class={clsx(iconStyle, props.class)} viewBox="0 0 24 24">
    <path d={icon} />
  </svg>
)

export default Icon
