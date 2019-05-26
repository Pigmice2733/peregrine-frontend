import { h } from 'preact'
import Chip, { DateChip } from '@/components/chip'
import Card, { CardProps } from '@/components/card'
import { css } from 'linaria'

type Props = CardProps<{
  event: {
    name: string
    district?: string
    week?: number
    startDate: Date
  }
}>

const eventCardStyle = css`
  display: flex;
  width: 23rem;
  max-width: calc(100% - 2rem);
  margin: 0.7rem auto;
  padding: 0.85rem;
  font-size: 0.93rem;
  justify-content: space-between;
  align-items: center;
`

const nameStyle = css`
  margin-right: auto;
`

const EventCard = ({ event, href }: Props) => (
  <Card href={href} class={eventCardStyle}>
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
