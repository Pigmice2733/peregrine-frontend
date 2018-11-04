import { h } from 'preact'
import Page from '@/components/page'
import { formatMatchKey } from '@/utils/format-match-key'
import LoadData from '@/load-data'
import { getEventInfo, getEventMatchInfo } from '@/api'
import { MatchCard } from '@/components/match-card'
import Spinner from '@/components/spinner'

interface Props {
  eventKey: string
  matchKey: string
}

const EventMatch = ({ eventKey, matchKey }: Props) => {
  const m = formatMatchKey(matchKey)
  return (
    <LoadData
      data={{
        eventInfo: () => getEventInfo(eventKey),
        matchInfo: () => getEventMatchInfo(eventKey, matchKey),
      }}
      renderSuccess={({ eventInfo, matchInfo }) => (
        <Page
          back={`/events/${eventKey}`}
          name={
            m.group +
            (m.num ? ' Match ' + m.num : '') +
            ' - ' +
            (eventInfo ? eventInfo.name : eventKey)
          }
        >
          {matchInfo ? <MatchCard match={matchInfo} /> : <Spinner />}
        </Page>
      )}
    />
  )
}

export default EventMatch
