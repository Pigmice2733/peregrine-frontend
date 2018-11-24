import { h } from 'preact'
import Page from '@/components/page'
import style from './style.css'
import LoadData from '@/load-data'
import InfoGroupCard from '@/components/info-group-card'
import { sortAscending } from '@/icons/sort-ascending'
import { history } from '@/icons/history'
import { MatchCard } from '@/components/match-card'
import { round } from '@/utils/round'
import { getEventInfo } from '@/api/event-info/get-event-info'
import { getEventTeamInfo } from '@/api/get-event-team-info'
import { getEventMatches } from '@/api/match-info/get-event-matches'

interface Props {
  eventKey: string
  teamNum: string
}

const EventTeam = ({ eventKey, teamNum }: Props) => (
  <LoadData
    data={{
      eventInfo: () => getEventInfo(eventKey),
      eventTeamInfo: () => getEventTeamInfo(eventKey, 'frc' + teamNum),
      eventMatches: () => getEventMatches(eventKey, 'frc' + teamNum),
    }}
    renderSuccess={({ eventInfo, eventTeamInfo, eventMatches }) => {
      const nextMatch =
        eventMatches &&
        eventMatches.find(
          m => m.redScore === undefined && m.blueScore === undefined,
        )
      return (
        <Page
          name={`${teamNum} @ ${eventInfo ? eventInfo.name : eventKey}`}
          back={`/events/${eventKey}`}
        >
          {nextMatch && (
            <div>
              <h2 class={style.section}>Next Match</h2>
              <MatchCard
                match={nextMatch}
                href={`/events/${eventKey}/matches/${nextMatch.key}`}
              />
            </div>
          )}
          <InfoGroupCard
            info={[
              {
                title: 'Rank',
                icon: sortAscending,
                action: eventTeamInfo ? eventTeamInfo.rank : '',
              },
              {
                title: 'Ranking Score',
                icon: history,
                action:
                  eventTeamInfo && eventTeamInfo.rankingScore
                    ? round(eventTeamInfo.rankingScore)
                    : '',
              },
            ]}
          />
        </Page>
      )
    }}
  />
)

export default EventTeam
