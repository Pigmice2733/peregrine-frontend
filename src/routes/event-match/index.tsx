import { h } from 'preact'
import Page from '@/components/page'
import { formatMatchKey } from '@/utils/format-match-key'
import LoadData from '@/load-data'
import { MatchCard } from '@/components/match-card'
import Spinner from '@/components/spinner'
import { getEventInfo } from '@/api/event-info/get-event-info'
import { getEventMatchInfo } from '@/api/match-info/get-event-match-info'
import Button from '@/components/button'
import style from './style.css'

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
          <div class={style.match}>
            {matchInfo ? <MatchCard match={matchInfo} /> : <Spinner />}
            <Button href={`/events/${eventKey}/matches/${matchKey}/scout`}>
              Scout Match
            </Button>
          </div>
        </Page>
      )}
    />
  )
}

export default EventMatch
