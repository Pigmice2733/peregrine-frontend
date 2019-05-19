import { h } from 'preact'
import style from './style.css'

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
})

const Chip = ({ children }: { children: string }) => (
  <span class={style.chip}>{children}</span>
)

export const DateChip = ({ date }: { date: Date }) => (
  <span class={`${style.dateChip} ${style.chip}`}>
    {dateFormatter.format(date)}
  </span>
)

export default Chip
