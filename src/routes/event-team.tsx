import { h, Fragment } from 'preact'
import Page from '@/components/page'
import InfoGroupCard from '@/components/info-group-card'
import { sortAscending } from '@/icons/sort-ascending'
import { history } from '@/icons/history'
import { MatchCard } from '@/components/match-card'
import { round } from '@/utils/round'
import { formatMatchKey } from '@/utils/format-match-key'
import { getEventTeamInfo } from '@/api/get-event-team-info'
import { getMatchTeamComments } from '@/api/report/get-match-team-comments'
import { compareMatches } from '@/utils/compare-matches'
import Card from '@/components/card'
import { css } from 'linaria'
import { useEventInfo } from '@/cache/event-info/use'
import { usePromise } from '@/utils/use-promise'
import { nextIncompleteMatch } from '@/utils/next-incomplete-match'
import { useEventMatches } from '@/cache/event-matches/use'

const sectionStyle = css`
  font-weight: normal;
  text-align: center;
  font-size: 1.2rem;
`

const commentsStyle = css`
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

const spacing = '0.5rem'

const eventTeamStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${spacing};

  & > * {
    margin: ${spacing};
  }
`

const EventTeam = ({ eventKey, teamNum }: Props) => {
  const eventInfo = useEventInfo(eventKey)
  const eventTeamInfo = usePromise(
    () => getEventTeamInfo(eventKey, 'frc' + teamNum),
    [eventKey, teamNum],
  )
  const teamMatches = useEventMatches(eventKey, 'frc' + teamNum)
  const teamComments = usePromise(
    () => getMatchTeamComments(eventKey, 'frc' + teamNum),
    [eventKey, teamNum],
  )

  const nextMatch = teamMatches && nextIncompleteMatch(teamMatches)

  return (
    <Page
      name={`${teamNum} @ ${eventInfo ? eventInfo.name : eventKey}`}
      back={`/events/${eventKey}`}
      class={eventTeamStyle}
    >
      {nextMatch && (
        <Fragment>
          <h2 class={sectionStyle}>Next Match</h2>
          <MatchCard
            match={nextMatch}
            href={`/events/${eventKey}/matches/${nextMatch.key}`}
          />
        </Fragment>
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
                  <a href={`/events/${eventKey}/match/${c.matchKey}`}>
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
}

export default EventTeam
