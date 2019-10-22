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
  const [term = '', setTerm] = useState(0);

  function searchingFor(term) {
    return function (x) {
      // because not all objects contain properties 'district' and 'fullDistrict' you have to check if particular object contains property 'distict' and if not tell method to not use it. Otherwise this error will occur (Uncaught (in promise) TypeError: Cannot read property 'toString' of undefined)
      if (x.hasOwnProperty('district')) {
        return (x.name.toString().toLowerCase().includes(term.toString().toLowerCase()) || !term) ||
          (x.key.toString().toLowerCase().includes(term.toString().toLowerCase()) || !term) ||
          (x.locationName.toString().toLowerCase().includes(term.toString().toLowerCase()) || !term) ||
          (x.district.toString().toLowerCase().includes(term.toString().toLowerCase()) || !term) ||
          (x.fullDistrict.toString().toLowerCase().includes(term.toString().toLowerCase()) || !term);
      }

      return (x.name.toString().toLowerCase().includes(term.toString().toLowerCase()) || !term) ||
        (x.key.toString().toLowerCase().includes(term.toString().toLowerCase()) || !term) ||
        (x.locationName.toString().toLowerCase().includes(term.toString().toLowerCase()) || !term);

    }
  }
  function searchHandler(event) {
    setTerm(event.target.value);
  }
  return (
    <Page name="Home" back={false}>
      <div>Search bar</div>
      <div class="searchBar">
        <input type="text" onInput={(e) => searchHandler(e)}
        />
      </div>
      <div>
        {events ? (
          events
            .filter(searchingFor(term))
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