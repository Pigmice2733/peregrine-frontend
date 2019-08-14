import { h } from 'preact'
import Page from '@/components/page'
import EventCard from '@/components/event-card'
import Spinner from '@/components/spinner'
import { compareEvents } from '@/utils/compare-events'
import { useEvents } from '@/cache/events'
import { useGeoLocation } from '@/utils/use-geo-location'

const now = new Date()

const Home = () => {
  const events = useEvents()
  const location = useGeoLocation()
  return (
    <Page name="Home" back={false}>
      <div>
        {events ? (
          events
            .sort(compareEvents(now, location))
            .map(e => (
              <EventCard href={`/events/${e.key}`} key={e.key} event={e} />
            ))
        ) : (
          <Spinner />
        )}
      </div>
    </Page>
  )
}

export default Home
