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
  key?: string
}

const EventCard = ({ event }: Props) => (
  <div class={style.eventCard}>
    <span class={style.name}>{event.name}</span>
    {event.district !== undefined && <Chip>{event.district}</Chip>}
    {event.week === undefined ? (
      <DateChip>{event.startDate}</DateChip>
    ) : (
      <Chip>{`Wk ${event.week + 1}`}</Chip>
    )}
  </div>
)

export default EventCard
