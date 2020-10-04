/* eslint-disable max-nested-callbacks */
import Page from '@/components/page'
import { useEventInfo } from '@/cache/event-info/use'
import { css } from 'linaria'
import Card from '@/components/card'
import Spinner from '@/components/spinner'
import { usePromise } from '@/utils/use-promise'
import { CommentCard } from '@/components/comment-card'
import { formatMatchKeyShort } from '@/utils/format-match-key-short'
import { compareMatchKeys } from '@/utils/compare-matches'
import { GetReport } from '@/api/report'
import { getReports } from '@/api/report/get-reports'

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
  const reports = usePromise(() => getReports({ team, event: eventKey }), [
    team,
    eventKey,
  ])
  const commentsByMatch = reports?.reduce<{ [matchKey: string]: GetReport[] }>(
    (acc, report) => {
      if (report.comment) {
        // eslint-disable-next-line caleb/@typescript-eslint/no-unnecessary-condition
        ;(acc[report.matchKey] || (acc[report.matchKey] = [])).push(report)
      }
      return acc
    },
    {},
  )

  return (
    <Page
      name={`Comments: ${teamNum} @ ${eventInfo ? eventInfo.name : eventKey}`}
      back={`/events/${eventKey}/teams/${teamNum}`}
      class={commentsPageStyle}
    >
      <Card class={matchListStyle}>
        {commentsByMatch ? (
          Object.keys(commentsByMatch).length === 0 ? (
            <span
              class={css`
                margin: 0 auto;
              `}
            >
              No comments
            </span>
          ) : (
            Object.entries(commentsByMatch)
              .sort(([a], [b]) => compareMatchKeys(a, b))
              .map(([matchKey, reports]) => (
                <MatchComments
                  key={matchKey}
                  match={matchKey}
                  reports={reports}
                  eventKey={eventKey}
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

  & > :first-child {
    font-weight: bold;
  }

  & > :not(:first-child) {
    grid-column: 2;
  }
`

const MatchComments = ({
  match,
  reports,
  eventKey,
}: {
  match: string
  reports: GetReport[]
  eventKey: string
}) => {
  return (
    <div class={matchCommentsStyle}>
      <a href={`/events/${eventKey}/matches/${match}`}>
        {formatMatchKeyShort(match)}
      </a>
      {reports.map((r) => (
        <CommentCard key={r.id} report={r} />
      ))}
    </div>
  )
}

export default EventTeamComments
