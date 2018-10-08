import { h } from 'preact'
import LoadData from '../../load-data'
import Page from '../../components/page'
import { getEventMatches } from '../../api'
import { MatchCard } from '../../components/match-card'

interface EventProps {
  eventKey: string
}

const Event = ({ eventKey }: EventProps) => (
  <Page name="Home">
    <LoadData
      data={{ matches: () => getEventMatches(eventKey) }}
      renderSuccess={({ matches }) => (
        <div>
          {matches && matches.map(m => <MatchCard key={m.key} match={m} />)}
        </div>
      )}
      renderError={({}) => <h1 />}
    />
  </Page>
)

export default Event
