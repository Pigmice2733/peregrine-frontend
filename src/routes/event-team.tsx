import { h } from 'preact'
import Page from '@/components/page'
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
import { css } from 'linaria'

const sectionStyle = css`
  font-weight: normal;
  text-align: center;
  font-size: 1.2rem;
`

const commentsStyle = css`
  margin: 1.2rem auto;
  width: 23rem;
  max-width: calc(100% - 2rem);
  padding: 1.1rem 0.5rem;

  & ul {
    margin: 0;
  }

  & li {
    padding: 0.3em 0.1em;
  }
`

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
              <h2 class={sectionStyle}>Next Match</h2>
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
          {teamComments && teamComments.length > 0 && (
            <Card class={commentsStyle}>
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
