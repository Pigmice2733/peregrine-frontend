import { h, Fragment } from 'preact'
import Page from '@/components/page'
import EventCard from '@/components/event-card'
import Spinner from '@/components/spinner'
import { compareEvents } from '@/utils/compare-events'
import { useGeoLocation } from '@/utils/use-geo-location'
import { useEvents } from '@/cache/events/use'
import { useState } from 'preact/hooks'
import TextInput from '@/components/text-input'
import { css } from 'linaria'
import { Dropdown } from '@/components/dropdown'
import { useQueryState } from '@/utils/use-query-state'
import { UnstyledList } from '@/components/unstyled-list'
import { useYears } from '@/utils/use-years'

const homeStyle = css`
  display: grid;
  justify-content: center;
  margin: 1rem;
  grid-gap: 1rem;
  grid-template-columns: minmax(auto, 23rem);
`

const matchListStyle = css`
  display: grid;
  grid-gap: 1rem;
`

const filterStyle = css`
  display: grid;
  grid-template-columns: min-content 1fr;
  grid-gap: 1rem;
`

const now = new Date()
const currentYear = now.getFullYear()
const Home = () => {
  const location = useGeoLocation()
  const [query, setQuery] = useState('')
  const lowerCaseQuery = query.toLowerCase()
  const [yearVal, setYear] = useQueryState('year', currentYear)
  const year = Number(yearVal)
  const years = useYears()
  const events = useEvents(year)

  return (
    <Page name="Home" back={false} class={homeStyle}>
      <div class={filterStyle}>
        <Dropdown options={years} onChange={setYear} value={year} />
        <TextInput onInput={setQuery} label="Search for Events" />
      </div>

      {events ? (
        <Fragment>
          <UnstyledList class={matchListStyle}>
            {events
              .filter((event) => {
                if (!query) return true
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
              .map((e) => (
                <li key={e.key}>
                  <EventCard event={e} />
                </li>
              ))}
          </UnstyledList>
          <a
            href="https://www.netlify.com"
            class={css`
              margin: 1rem auto;
            `}
          >
            <img
              alt="Deploys by Netlify"
              src="https://www.netlify.com/img/global/badges/netlify-color-accent.svg"
            />
          </a>
        </Fragment>
      ) : (
        <Spinner />
      )}
    </Page>
  )
}

export default Home
