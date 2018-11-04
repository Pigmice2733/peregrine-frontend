import { h } from 'preact'
import Page from '@/components/page'
import style from './style.css'
import LoadData from '@/load-data'
import { getEventInfo, getEventTeamInfo, getEventMatches } from '@/api'
import InfoGroupCard from '@/components/info-group-card'
import { sortAscending } from '@/icons/sort-ascending'
import { history } from '@/icons/history'
import { MatchCard } from '@/components/match-card'
import { round } from '@/utils/round'
import Spinner from '@/components/spinner'

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
              <MatchCard match={nextMatch} />
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
