import { h } from 'preact'
import style from './style.css'
import { BasicEventInfo } from '../../api'
import { CardPlaceholder } from '../../components/card-placeholder'
import { Chip } from '../../components/chip'

interface HomeProps {
  events?: BasicEventInfo[]
}

interface EventCardProps {
  event: BasicEventInfo
}

const EventCard = ({ event: { name, week } }: EventCardProps) => (
  <div class={style.eventCard}>
    <div>{name}</div>
    {week && <Chip>WK {week}</Chip>}
  </div>
)

const frcEvent: BasicEventInfo = {
  name: 'Wilsonville',
  district: 'PNW',
  week: 2,
  startDate: 'Fri, 02 Feb 1996 03:04:05 GMT',
  endDate: 'Sat, 03 Feb 1996 03:04:05 GMT',
  location: {
    lat: 50,
    lon: 100,
  },
}

const Home = ({ events }: HomeProps) => (
  <div class={style.home}>
    <EventCard event={frcEvent} />
    {events ? <div>{JSON.stringify(events)}</div> : <CardPlaceholder />}
  </div>
)

export default Home
