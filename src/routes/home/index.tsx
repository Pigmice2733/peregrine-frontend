import { h } from 'preact'
import LoadData from '@/load-data'
import Page from '@/components/page'
import EventCard from '@/components/event-card'
import Spinner from '@/components/spinner'
import { getEvents } from '@/api/event-info/get-events'
import { compareEvents } from '@/utils/compare-events'

import { styled } from 'linaria-styled-preact'

const Container = styled.div`
  background-color: blue;
`

const Home = () => (
  <Page name="Home">
    <h1>Foo</h1>
    <Container>Foo</Container>
    <LoadData
      data={{ events: getEvents }}
      renderSuccess={({ events }) => (
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
      )}
      renderError={({ events }) => <h1>ERROR: {events && events.message}</h1>}
    />
  </Page>
)

export default Home
