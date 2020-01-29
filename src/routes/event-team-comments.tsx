import { h } from 'preact'
import Page from '@/components/page'
import { useEventInfo } from '@/cache/event-info/use'
import { css } from 'linaria'
import Card from '@/components/card'
import { useEventMatches } from '@/cache/event-matches/use'
import Spinner from '@/components/spinner'
import { usePromise } from '@/utils/use-promise'
import { getMatchTeamReports } from '@/api/report/get-match-team-reports'
import { CommentCard } from '@/components/comment-card'
import { formatMatchKeyShort } from '@/utils/format-match-key-short'
import { compareMatches } from '@/utils/compare-matches'

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
  const matches = useEventMatches(eventKey, 'frc' + teamNum)

  return (
    <Page
      name={`Comments: ${teamNum} @ ${eventInfo ? eventInfo.name : eventKey}`}
      back={`/events/${eventKey}/teams/${teamNum}`}
      class={commentsPageStyle}
    >
      <Card class={matchListStyle}>
        {matches ? (
          matches
            .sort(compareMatches)
            .map(m => (
              <MatchComments
                key={m.key}
                match={m.key}
                team={`frc${teamNum}`}
                event={eventKey}
              />
            ))
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
  team,
  event,
}: {
  match: string
  team: string
  event: string
}) => {
  const reports = usePromise(
    () =>
      getMatchTeamReports(event, match, team).then(reports =>
        reports.filter(r => r.comment),
      ),
    [event, match, team],
  )
  if (!reports || reports.length === 0) return null

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
