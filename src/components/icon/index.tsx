import { h } from 'preact'
import style from './style.css'

interface Props {
  icon: string
}

const Icon = ({ icon }: Props) => (
  <svg class={style.icon} viewBox="0 0 24 24">
    <path d={icon} />
  </svg>
)

export default Icon
