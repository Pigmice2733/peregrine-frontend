/* eslint-disable max-nested-callbacks */
import { h } from 'preact'
import Page from '@/components/page'
import { useEventInfo } from '@/cache/event-info/use'
import { css } from 'linaria'
import Card from '@/components/card'
import Spinner from '@/components/spinner'
import { usePromise } from '@/utils/use-promise'
import { getMatchTeamReports } from '@/api/report/get-match-team-reports'
import { CommentCard } from '@/components/comment-card'
import { formatMatchKeyShort } from '@/utils/format-match-key-short'
import { compareMatches } from '@/utils/compare-matches'
import { getEventMatches } from '@/api/match-info/get-event-matches'
import { GetReport } from '@/api/report'

interface Props {
  eventKey: string
  teamNum: string
}

const commentsPageStyle = css``
const matchListStyle = css`
  width: 30rem;
  max-width: calc(100% - 4rem);
  margin: 2rem auto;
  padding: 1.2rem;
  display: grid;
  grid-gap: 2rem;
`

const EventTeamComments = ({ eventKey, teamNum }: Props) => {
  const eventInfo = useEventInfo(eventKey)
  const team = 'frc' + teamNum
  const matchesWithComments = usePromise(
    () =>
      getEventMatches(eventKey, team)
        .then(allMatches =>
          Promise.all(
            allMatches.sort(compareMatches).map(m =>
              getMatchTeamReports(eventKey, m.key, team).then(reports => ({
                reports: reports.filter(r => r.comment),
                matchKey: m.key,
              })),
            ),
          ),
        )
        .then(matchesWithReports =>
          matchesWithReports.filter(m => m.reports.length > 0),
        ),
    [eventKey, teamNum],
  )

  return (
    <Page
      name={`Comments: ${teamNum} @ ${eventInfo ? eventInfo.name : eventKey}`}
      back={`/events/${eventKey}/teams/${teamNum}`}
      class={commentsPageStyle}
    >
      <Card class={matchListStyle}>
        {matchesWithComments ? (
          matchesWithComments.length === 0 ? (
            <span
              class={css`
                margin: 0 auto;
              `}
            >
              No comments
            </span>
          ) : (
            matchesWithComments.map(({ matchKey, reports }) => (
              <MatchComments
                key={matchKey}
                match={matchKey}
                reports={reports}
              />
            ))
          )
        ) : (
          <Spinner />
        )}
      </Card>
    </Page>
  )
}

const matchCommentsStyle = css`
  display: grid;
  grid-template-columns: 4rem 1fr;
  grid-gap: 1.2rem;

  & > span {
    font-weight: bold;
  }
`

const MatchComments = ({
  match,
  reports,
}: {
  match: string
  reports: GetReport[]
}) => {
  return (
    <div class={matchCommentsStyle}>
      <span>{formatMatchKeyShort(match)}</span>
      {reports.map(r => (
        <CommentCard key={JSON.stringify(r)} report={r} />
      ))}
    </div>
  )
}

export default EventTeamComments
