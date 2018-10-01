import { h } from 'preact'
import { getEvents } from '../../api'
import LoadData from '../../load-data'
import Page from '../../components/page'
import EventCard from '../../components/event-card'

const Home = () => (
  <Page name="Home">
    <LoadData
      data={{ events: getEvents }}
      renderSuccess={({ events }) => (
        <div>
          {events
            ? events.map(e => <EventCard key={e.key} event={e} />)
            : 'loading'}
        </div>
      )}
      renderError={({ events }) => <h1>ERROR: {events && events.message}</h1>}
    />
  </Page>
)

export default Home
