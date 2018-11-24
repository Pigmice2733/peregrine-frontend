import { h } from 'preact'
import style from './style.css'

const formatDate = (d: Date) =>
  d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

const Chip = ({ children }: { children: string }) => (
  <span class={style.chip}>{children}</span>
)

export const DateChip = ({ date }: { date: Date }) => (
  <span class={`${style.dateChip} ${style.chip}`}>{formatDate(date)}</span>
)

export default Chip
