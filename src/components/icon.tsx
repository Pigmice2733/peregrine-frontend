import { css } from 'linaria'

interface Props extends JSX.HTMLAttributes<SVGSVGElement> {
  icon: string
}

const iconStyle = css`
  width: 1.5rem;
  height: auto;
  fill: currentColor;
`

const Icon = ({ icon, ...props }: Props) => (
  <svg {...props} class={props.class || iconStyle} viewBox="0 0 24 24">
    <path d={icon} />
  </svg>
)

export default Icon
