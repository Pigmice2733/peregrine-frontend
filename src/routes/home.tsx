import { h } from 'preact'
import { getEvents } from '../api'
import LoadData from '../load-data'

const Home = () => (
  <LoadData
    data={{ events: getEvents }}
    renderSuccess={({ events }) => (
      <div>
        {events
          ? events.slice(0, 20).map(e => <h2 key={e.key}>{e.name}</h2>)
          : 'no events'}
      </div>
    )}
    renderError={({ events }) => <h1>ERROR: {events && events.message}</h1>}
  />
)

export default Home
