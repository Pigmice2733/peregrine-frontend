import { h } from 'preact'
import Page from '@/components/page'
import EventCard from '@/components/event-card'
import Spinner from '@/components/spinner'
import { compareEvents } from '@/utils/compare-events'
import { useGeoLocation } from '@/utils/use-geo-location'
import { useEvents } from '@/cache/events/use'
import { useState } from 'preact/hooks'
import TextInput from '@/components/text-input'
import { css } from 'linaria'

const homeStyle = css`
  display: grid;
  grid-gap: 0.7rem;
  justify-content: center;
  margin: 1rem;
  grid-template-columns: minmax(auto, 23rem);
`

const now = new Date()
const Home = () => {
  const events = useEvents()
  const location = useGeoLocation()
  const [term, setTerm] = useState('')
  const lowerCaseQuery = term.toString().toLowerCase()

  return (
    <Page name="Home" back={false} class={homeStyle}>
      <TextInput onInput={setTerm} label="Search for Events" />

      {events ? (
        events
          .filter(event => {
            if (!term) return true
            return (
              event.name.toLowerCase().includes(lowerCaseQuery) ||
              event.key.toLowerCase().includes(lowerCaseQuery) ||
              event.locationName.toLowerCase().includes(lowerCaseQuery) ||
              event.district?.toLowerCase().includes(lowerCaseQuery) ||
              event.fullDistrict?.toLowerCase().includes(lowerCaseQuery)
            )
          })
          .sort(compareEvents(now, location))
          .slice(0, 20) // Displaying just the first 20 to improve rendering/re-rendering performance (esp. while searching)
          .map(e => (
            <EventCard href={`/events/${e.key}`} key={e.key} event={e} />
          ))
      ) : (
        <Spinner />
      )}
    </Page>
  )
}

export default Home
