import { getEventTeamInfo } from '@/api/event-team-info/get-event-team-info'
import { ProcessedMatchInfo } from '@/api/match-info'
import { saveTeam } from '@/api/save-teams'
import { useEventInfo } from '@/cache/event-info/use'
import { useEventMatches } from '@/cache/event-matches/use'
import { useSchema } from '@/cache/schema/use'
import Button from '@/components/button'
import { ChartCard } from '@/components/chart'
import InfoGroupCard from '@/components/info-group-card'
import { MatchCard } from '@/components/match-card'
import Page from '@/components/page'
import { history } from '@/icons/history'
import { mapMarker } from '@/icons/map-marker'
import { sortAscending } from '@/icons/sort-ascending'
import { Falsy } from '@/type-utils'
import { compareMatches } from '@/utils/compare-matches'
import { formatMatchKeyShort } from '@/utils/format-match-key-short'
import { formatTimeWithoutDate } from '@/utils/format-time'
import { nextIncompleteMatch } from '@/utils/next-incomplete-match'
import { round } from '@/utils/round'
import { useCurrentTime } from '@/utils/use-current-time'
import { usePromise } from '@/utils/use-promise'
import { css } from 'linaria'
import { Fragment, h } from 'preact'

const sectionStyle = css`
  font-weight: normal;
  text-align: center;
  font-size: 1.2rem;
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

const minute = 1000 * 60
const matchCycleDuration = 7 * minute
const afterMatchDuration = 10 * minute
const queueDuration = 20 * minute

const isCurrent = (now: Date) => (match: ProcessedMatchInfo): boolean => {
  const matchStartTime = match.time
  if (!matchStartTime) return false
  // match starts at 3:04
  // match is current till 3:11 (+7m)
  const matchEndTime = new Date(matchStartTime.getTime() + matchCycleDuration)
  return matchStartTime < now && now < matchEndTime
}

const enum TeamState {
  Queueing,
  InMatch,
  AfterMatch,
}

const formatTeamLocation = (
  teamLocation: Exclude<TeamLocation, Falsy>,
  eventKey: string,
) => {
  const matchKey = teamLocation.match.key
  const match = (
    <a href={`/events/${eventKey}/matches/${matchKey}`}>
      {formatMatchKeyShort(matchKey)}
    </a>
  )
  if (teamLocation.state === TeamState.Queueing)
    return <Fragment>Queueing for {match}</Fragment>
  if (teamLocation.state === TeamState.InMatch)
    return <Fragment>In {match}</Fragment>
  return <Fragment>Just finished {match}</Fragment>
}

const guessTeamLocation = (
  teamMatches: ProcessedMatchInfo[],
  now: Date,
): TeamLocation => {
  const currentTime = now.getTime()
  const currentMatch = teamMatches.find(isCurrent(now))
  if (currentMatch)
    return {
      match: currentMatch,
      state:
        // If the match results are posted before the match is predicted to be finished, it should show as "after match"
        currentMatch.blueScore === undefined
          ? TeamState.InMatch
          : TeamState.AfterMatch,
    }

  const queueMatch = teamMatches.find((m) => {
    if (!m.time) return false

    const matchStartTime = m.time.getTime()
    // match starts at 3:04
    // match queueing starts at 2:39
    // verify that 2:39 < now < 3:04
    const matchQueueStartTime = matchStartTime - queueDuration
    return matchQueueStartTime < currentTime && currentTime < matchStartTime
  })

  if (queueMatch) return { match: queueMatch, state: TeamState.Queueing }

  const matchThatJustFinished = teamMatches.find((m) => {
    if (!m.time) return false
    const matchStartTime = m.time.getTime()
    const matchEndTime = matchStartTime + matchCycleDuration
    // match started at 3:04
    // match ended at 3:11 (+7m)
    // verify that 3:11 < now < 3:21 (+10m)
    return (
      matchEndTime < currentTime &&
      currentTime < matchEndTime + afterMatchDuration
    )
  })
  if (matchThatJustFinished)
    return {
      match: matchThatJustFinished,
      state:
        // If the match is "past" its end time, but scores haven't been posted yet, it should display "in match"
        matchThatJustFinished.blueScore === undefined
          ? TeamState.InMatch
          : TeamState.AfterMatch,
    }
}

type TeamLocation =
  | {
      match: ProcessedMatchInfo
      state: TeamState
    }
  | null
  | undefined

const EventTeam = ({ eventKey, teamNum }: Props) => {
  const eventInfo = useEventInfo(eventKey)
  const eventTeamInfo = usePromise(
    () => getEventTeamInfo(eventKey, 'frc' + teamNum).catch(() => undefined),
    [eventKey, teamNum],
  )
  const schema = useSchema(eventInfo?.schemaId)
  const teamMatches = useEventMatches(eventKey, 'frc' + teamNum)?.sort(
    compareMatches,
  )
  const now = useCurrentTime()

  const teamLocation = teamMatches && guessTeamLocation(teamMatches, now)

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
          <MatchCard match={nextMatch} eventKey={eventKey} link />
        </Fragment>
      )}
      <InfoGroupCard
        info={[
          {
            title: 'Rank',
            icon: sortAscending,
            action: eventTeamInfo ? eventTeamInfo.rank : '?',
          },
          {
            title: 'Ranking Score',
            icon: history,
            action: eventTeamInfo?.rankingScore
              ? round(eventTeamInfo.rankingScore)
              : '?',
          },
          teamLocation && {
            title: formatTeamLocation(teamLocation, eventKey),
            icon: mapMarker,
            action: teamLocation.match.time && (
              <span
                class={css`
                  color: #757575;
                  font-size: 0.75rem;
                `}
              >
                {formatTimeWithoutDate(teamLocation.match.time)}
              </span>
            ),
          },
        ]}
      />
      <Button href={`/events/${eventKey}/teams/${teamNum}/comments`}>
        View all comments
      </Button>
      <Button href={`/events/${eventKey}/teams/${teamNum}/matches`}>
        View Matches
      </Button>
      <Button onClick={() => saveTeam(teamNum, eventKey)}>Save Team</Button>
      {teamMatches && schema && (
        <ChartCard
          team={'frc' + teamNum}
          eventKey={eventKey}
          schema={schema}
          teamMatches={teamMatches}
        />
      )}
    </Page>
  )
}

export default EventTeam
