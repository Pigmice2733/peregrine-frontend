import Chip, { DateChip } from '@/components/chip'
import Card from '@/components/card'
import { css } from 'linaria'

type Props = {
  event: {
    key: string
    name: string
    district?: string
    week?: number
    startDate: Date
  }
}

const eventCardStyle = css`
  display: flex;
  padding: 0.85rem;
  font-size: 0.93rem;
  justify-content: space-between;
  align-items: center;
`

const nameStyle = css`
  margin-right: auto;
`

const EventCard = ({ event }: Props) => (
  <Card href={`/events/${event.key}`} class={eventCardStyle}>
    <span class={nameStyle}>{event.name}</span>
    {event.district !== undefined && <Chip>{event.district}</Chip>}
    {event.week === undefined ? (
      <DateChip date={event.startDate} />
    ) : (
      <Chip>{`Wk ${event.week + 1}`}</Chip>
    )}
  </Card>
)

export default EventCard
