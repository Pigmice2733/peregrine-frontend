import { h } from 'preact'
import LoadData from '../../load-data'
import Page from '../../components/page'
import { getEventMatches, getEventInfo } from '../../api'
import { MatchCard } from '../../components/match-card'

interface Props {
  eventKey: string
}

const Event = ({ eventKey }: Props) => (
  <LoadData
    data={{
      matches: () => getEventMatches(eventKey),
      eventInfo: () => getEventInfo(eventKey),
    }}
    renderSuccess={({ matches, eventInfo }) => (
      <Page
        name={(eventInfo && eventInfo.name) || <code>{eventKey}</code>}
        back="/"
      >
        <div>
          {matches && matches.map(m => <MatchCard key={m.key} match={m} />)}
        </div>
      </Page>
    )}
    renderError={({ matches }) => <h1>Error loading matches: {matches}</h1>}
  />
)

export default Event
