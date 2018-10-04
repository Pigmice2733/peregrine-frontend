import { h } from 'preact'
import LoadData from '../../load-data'
import Page from '../../components/page'
import { getEventMatches, MatchInfo } from '../../api'
import { formatTeamNumber } from '../../utils'

interface MatchCardProps {
  match: MatchInfo
}

const MatchCard = ({ match }: MatchCardProps) => (
  <div>
    <h1>{match.key}</h1>
    <h2>{match.time}</h2>
    <h2 style={{ color: 'red' }}>
      {match.redAlliance.map(formatTeamNumber).join(' ')}
    </h2>
    <h2 style={{ color: 'blue' }}>
      {match.blueAlliance.map(formatTeamNumber).join(' ')}
    </h2>
  </div>
)

interface EventProps {
  eventKey: string
}

const Event = ({ eventKey }: EventProps) => (
  <Page name="Home">
    <LoadData
      data={{ matches: () => getEventMatches(eventKey) }}
      renderSuccess={({ matches }) => {
        console.log(matches)
        return (
          <div>
            Hello {eventKey}{' '}
            {matches && matches.map(m => <MatchCard match={m} />)}
          </div>
        )
      }}
      renderError={({}) => <h1 />}
    />
  </Page>
)

export default Event
