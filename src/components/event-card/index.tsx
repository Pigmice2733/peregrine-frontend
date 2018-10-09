import { h } from 'preact'
import style from './style.css'
import Chip, { DateChip } from '../../components/chip'

interface Props {
  event: {
    name: string
    district?: string
    week?: number
    startDate: string
  }
  href?: string
  key?: string | number
}

const EventCard = ({ event, href }: Props) => (
  <a href={href} class={style.eventCard}>
    <span class={style.name}>{event.name}</span>
    {event.district !== undefined && <Chip>{event.district}</Chip>}
    {event.week === undefined ? (
      <DateChip>{event.startDate}</DateChip>
    ) : (
      <Chip>{`Wk ${event.week + 1}`}</Chip>
    )}
  </a>
)

export default EventCard
