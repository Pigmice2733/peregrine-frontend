import { h } from 'preact'
import Page from '@/components/page'
import style from './style.css'
import LoadData from '@/load-data'
import InfoGroupCard from '@/components/info-group-card'
import { sortAscending } from '@/icons/sort-ascending'
import { history } from '@/icons/history'
import { MatchCard } from '@/components/match-card'
import { round } from '@/utils/round'
import { formatMatchKey } from '@/utils/format-match-key'
import { getEventInfo } from '@/api/event-info/get-event-info'
import { getEventTeamInfo } from '@/api/get-event-team-info'
import { getEventMatches } from '@/api/match-info/get-event-matches'
import { getMatchTeamComments } from '@/api/report/get-match-team-comments'
import { compareMatches } from '@/utils/compare-matches'
import Card from '@/components/card'

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
      teamComments: () => getMatchTeamComments(eventKey, 'frc' + teamNum),
    }}
    renderSuccess={({
      eventInfo,
      eventTeamInfo,
      eventMatches,
      teamComments,
    }) => {
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
          {teamComments && (
            <Card class={style.comments}>
              <ul>
                {teamComments
                  .sort((a, b) =>
                    compareMatches({ key: a.matchKey }, { key: b.matchKey }),
                  )
                  .map(c => (
                    <li key={c.id}>
                      <a href={`/events/${eventKey}/matches/${c.matchKey}`}>
                        {formatMatchKey(c.matchKey).group}
                      </a>
                      : {c.comment}
                    </li>
                  ))}
              </ul>
            </Card>
          )}
        </Page>
      )
    }}
  />
)

export default EventTeam
