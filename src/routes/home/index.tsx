import { h } from 'preact'
import Page from '@/components/page'
import EventCard from '@/components/event-card'
import Spinner from '@/components/spinner'
import { compareEvents } from '@/utils/compare-events'
import { useEvents } from '@/cache/events'

const Home = () => {
  const events = useEvents()
  return (
    <Page name="Home">
      <div>
        {events ? (
          events
            .sort(compareEvents)
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
