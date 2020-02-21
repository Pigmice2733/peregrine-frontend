import { h, Fragment } from 'preact'
import Page from '@/components/page'
import InfoGroupCard from '@/components/info-group-card'
import { sortAscending } from '@/icons/sort-ascending'
import { history } from '@/icons/history'
import { MatchCard } from '@/components/match-card'
import { round } from '@/utils/round'
import { getEventTeamInfo } from '@/api/get-event-team-info'
import { css } from 'linaria'
import { useEventInfo } from '@/cache/event-info/use'
import { usePromise } from '@/utils/use-promise'
import { nextIncompleteMatch } from '@/utils/next-incomplete-match'
import { ChartCard } from '@/components/chart'
import { useEventMatches } from '@/cache/event-matches/use'
import { useSchema } from '@/cache/schema/use'
import Button from '@/components/button'
import { matchHasTeam } from '@/utils/match-has-team'
import { compareMatches } from '@/utils/compare-matches'
import { lerp } from '@/utils/lerp'
import { useState } from 'preact/hooks'
import { formatMatchKeyShort } from '@/utils/format-match-key-short'
import { formatTimeWithoutDate } from '@/utils/format-time'
import { ProcessedMatchInfo } from '@/api/match-info'
import { mapMarker } from '@/icons/map-marker'
import { Falsy } from '@/type-utils'

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

const eventStartTime = new Date('Sat Feb 15 2020 08:00 EST')
const eventEndTime = new Date('Sat Feb 15 2020 16:00 EST')

const minute = 1000 * 60
const matchCycleDuration = 7 * minute
const afterMatchDuration = 10 * minute
const queueDuration = 20 * minute

const isCurrent = (now: Date) => (match: ProcessedMatchInfo): boolean => {
  const matchStartTime = match.time
  if (!matchStartTime) return false
  // match starts at 3:04
  // match is current till 3:14 (+10m)
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
  eventMatches: ProcessedMatchInfo[],
  teamNum: string,
  now: Date,
): TeamLocation => {
  const currentTime = now.getTime()
  const teamMatches = eventMatches.filter(matchHasTeam('frc' + teamNum))
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

  const queueMatch = teamMatches.find(m => {
    if (!m.time) return false

    const matchStartTime = m.time.getTime()
    // match starts at 3:04
    // match queueing starts at 2:34
    // verify that 2:34 < now < 3:04
    const matchQueueStartTime = matchStartTime - queueDuration
    return matchQueueStartTime < currentTime && currentTime < matchStartTime
  })

  if (queueMatch) return { match: queueMatch, state: TeamState.Queueing }

  const matchThatJustFinished = teamMatches.find(m => {
    if (!m.time) return false
    const matchStartTime = m.time.getTime()
    const matchEndTime = matchStartTime + matchCycleDuration
    // match started at 3:04
    // match ended at 3:14 (+10m)
    // verify that match results posted and 3:14 < now < 3:24 (+10m)
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
    () => getEventTeamInfo(eventKey, 'frc' + teamNum),
    [eventKey, teamNum],
  )
  const schema = useSchema(eventInfo?.schemaId)
  const eventMatches = useEventMatches(eventKey)?.sort(compareMatches)
  const teamMatches = eventMatches?.filter(matchHasTeam('frc' + teamNum))
  const [timePercent, setTimePercent] = useState(0)
  // const now = useCurrentTime()
  const now = new Date(
    lerp(0, 1, eventStartTime.getTime(), eventEndTime.getTime())(timePercent),
  )

  const teamLocation =
    eventMatches && guessTeamLocation(eventMatches, teamNum, now)

  const nextMatch = teamMatches && nextIncompleteMatch(teamMatches)

  return (
    <Page
      name={`${teamNum} @ ${eventInfo ? eventInfo.name : eventKey}`}
      back={`/events/${eventKey}`}
      class={eventTeamStyle}
    >
      <input
        type="range"
        min="0"
        step="0.0001"
        max="1"
        style={{ width: '80vw' }}
        onInput={e => setTimePercent(e.currentTarget.valueAsNumber)}
      />
      <p>{now.toLocaleTimeString()}</p>
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
            action: eventTeamInfo?.rankingScore
              ? round(eventTeamInfo.rankingScore)
              : '',
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
      {eventMatches && schema && (
        <ChartCard
          team={'frc' + teamNum}
          eventKey={eventKey}
          schema={schema}
          teamMatches={eventMatches}
        />
      )}
    </Page>
  )
}

export default EventTeam
