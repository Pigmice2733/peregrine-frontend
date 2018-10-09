import { h } from 'preact'
import LoadData from '../../load-data'
import Page from '../../components/page'
import { getEventMatches, getEventInfo } from '../../api'
import { MatchCard } from '../../components/match-card'

interface EventProps {
  eventKey: string
}

const Event = ({ eventKey }: EventProps) => (
  <LoadData
    data={{
      matches: () => getEventMatches(eventKey),
      eventInfo: () => getEventInfo(eventKey),
    }}
    renderSuccess={({ matches, eventInfo }) => (
      <Page name={(eventInfo && eventInfo.name) || <code>{eventKey}</code>}>
        <div>
          {matches && matches.map(m => <MatchCard key={m.key} match={m} />)}
        </div>
      </Page>
    )}
    renderError={({}) => <h1 />}
  />
)

export default Event
