import { h } from 'preact'
import style from './style.css'

interface Props {
  children: string
}

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

const Chip = ({ children }: Props) => <span class={style.chip}>{children}</span>
export const DateChip = ({ children }: Props) => (
  <span class={`${style.dateChip} ${style.chip}`}>
    {formatDate(children[0])}
  </span>
)

export default Chip
