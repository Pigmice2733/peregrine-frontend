import { h } from 'preact'
import Page from '@/components/page'
import EventCard from '@/components/event-card'
import Spinner from '@/components/spinner'
import { compareEvents } from '@/utils/compare-events'
import { useGeoLocation } from '@/utils/use-geo-location'
import { useEvents } from '@/cache/events/use'
import { useState } from 'preact/hooks'

const now = new Date()
const Home = () => {
  const events = useEvents()
  const location = useGeoLocation()
  const [term, setTerm] = useState('')
  const lowerCaseQuery = term.toString().toLowerCase()

  return (
    <Page name="Home" back={false}>
      <div>Search bar</div>
      <div class="searchBar">
        <input type="text" onInput={(e: any) => setTerm(e.target.value)} />
      </div>
      <div>
        {events ? (
          events
            .filter(event => {
              if (!term) return true
              return (
                event.name.toLowerCase().includes(lowerCaseQuery) ||
                event.key.toLowerCase().includes(lowerCaseQuery) ||
                event.locationName.toLowerCase().includes(lowerCaseQuery) ||
                (event.district !== undefined &&
                  event.district.toLowerCase().includes(lowerCaseQuery)) ||
                (event.fullDistrict !== undefined &&
                  event.fullDistrict.toLowerCase().includes(lowerCaseQuery))
              )
            })
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
