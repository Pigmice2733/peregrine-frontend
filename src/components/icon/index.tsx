import { h } from 'preact'
import { css } from 'linaria'

interface Props {
  icon: string
}

const iconStyle = css`
  width: 1.5rem;
  height: 1.5rem;
  fill: currentColor;
`

const Icon = ({ icon }: Props) => (
  <svg class={iconStyle} viewBox="0 0 24 24">
    <path d={icon} />
  </svg>
)

export default Icon
