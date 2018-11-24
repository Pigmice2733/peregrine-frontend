import { h } from 'preact'
import Chip, { DateChip } from '@/components/chip'
import Card, { CardProps } from '@/components/card'

import style from './style.css'

type Props = CardProps<{
  event: {
    name: string
    district?: string
    week?: number
    startDate: Date
  }
}>

const EventCard = ({ event, href }: Props) => (
  <Card href={href} class={style.eventCard}>
    <span class={style.name}>{event.name}</span>
    {event.district !== undefined && <Chip>{event.district}</Chip>}
    {event.week === undefined ? (
      <DateChip date={event.startDate} />
    ) : (
      <Chip>{`Wk ${event.week + 1}`}</Chip>
    )}
  </Card>
)

export default EventCard
