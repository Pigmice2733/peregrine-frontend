import Page from '@/components/page'
import InfoGroupCard from '@/components/info-group-card'
import {
  mdiHistory,
  mdiMapMarker,
  mdiStarOutline,
  mdiStar,
  mdiSortDescending,
} from '@mdi/js'
import { MatchDetailsCard } from '@/components/match-card'
import { round } from '@/utils/round'
import { getEventTeamInfo } from '@/api/event-team-info/get-event-team-info'
import { css } from 'linaria'
import { useEventInfo } from '@/cache/event-info/use'
import { usePromise } from '@/utils/use-promise'
import { getUpcomingMatches } from '@/utils/upcoming-matches'
import { ChartCard } from '@/components/chart'
import { useEventMatches } from '@/cache/event-matches/use'
import { useSchema } from '@/cache/schema/use'
import Button from '@/components/button'
import { compareMatches } from '@/utils/compare-matches'
import { formatMatchKeyShort } from '@/utils/format-match-key-short'
import { formatTimeWithoutDate } from '@/utils/format-time'
import { ProcessedMatchInfo } from '@/api/match-info'
import { Falsy } from '@/type-utils'
import { useCurrentTime } from '@/utils/use-current-time'
import { saveTeam, useSavedTeams, removeTeam } from '@/api/save-teams'
import IconButton from '@/components/icon-button'
import { EventTeamInfo } from '@/api/event-team-info'
import { Heading } from '@/components/heading'

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
    return <>Queueing for {match}</>
  if (teamLocation.state === TeamState.InMatch) return <>In {match}</>
  return <>Just finished {match}</>
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
    const matchQueueStartTime = matchStartTime - queueDuration
    return matchQueueStartTime < currentTime && currentTime < matchStartTime
  })

  if (queueMatch) return { match: queueMatch, state: TeamState.Queueing }

  const matchThatJustFinished = teamMatches.find((m) => {
    if (!m.time) return false
    const matchStartTime = m.time.getTime()
    const matchEndTime = matchStartTime + matchCycleDuration
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

const pageHeadingStyle = css`
  display: flex;
  align-items: center;
`
const teamHeadingSpanStyle = css`
  margin-right: 0.3rem;
`

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

  const currentTime = useCurrentTime().getTime()
  const upcomingMatches =
    teamMatches && getUpcomingMatches(teamMatches, currentTime)

  const savedTeams = useSavedTeams()
  const isTeamSaved = savedTeams.some(
    (team) => team.teamNum === teamNum && team.eventKey === eventKey,
  )

  return (
    <Page
      name={
        <span class={pageHeadingStyle}>
          <span class={teamHeadingSpanStyle}>{`${teamNum} @ ${
            eventInfo ? eventInfo.name : eventKey
          }`}</span>
          <IconButton
            icon={isTeamSaved ? mdiStar : mdiStarOutline}
            onClick={() =>
              isTeamSaved
                ? removeTeam(teamNum, eventKey)
                : saveTeam(teamNum, eventKey)
            }
            title={isTeamSaved ? 'Remove Team' : 'Save Team'}
          />
        </span>
      }
      back={`/events/${eventKey}`}
      class={eventTeamStyle}
    >
      {upcomingMatches && upcomingMatches.length > 0 ? (
        <>
          <Heading level={2}>Upcoming Matches</Heading>
          <div
            class={css`
              display: grid;
              grid-template-columns: 20rem;
              justify-self: stretch;
            `}
          >
            {upcomingMatches.map((match) => (
              <MatchDetailsCard
                key={match.key}
                match={match}
                eventKey={eventKey}
                link
              />
            ))}
          </div>
        </>
      ) : (
        <p
          class={css`
            color: gray;
            text-align: center;
            margin: 1rem 0 0.8rem;
          `}
        >
          No Upcoming Matches
        </p>
      )}
      <EventTeamInfoCard
        eventKey={eventKey}
        eventTeamInfo={eventTeamInfo}
        teamMatches={teamMatches}
      />
      <Button href={`/events/${eventKey}/teams/${teamNum}/comments`}>
        View all comments
      </Button>
      <Button href={`/events/${eventKey}/teams/${teamNum}/matches`}>
        View Matches
      </Button>
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

const EventTeamInfoCard = ({
  eventTeamInfo,
  teamMatches,
  eventKey,
}: {
  eventTeamInfo?: EventTeamInfo
  teamMatches?: ProcessedMatchInfo[]
  eventKey: string
}) => {
  const now = useCurrentTime()
  const teamLocation = teamMatches && guessTeamLocation(teamMatches, now)
  return (
    <InfoGroupCard
      info={[
        {
          title: 'Rank',
          icon: mdiSortDescending,
          action: eventTeamInfo ? eventTeamInfo.rank : '?',
        },
        {
          title: 'Ranking Score',
          icon: mdiHistory,
          action: eventTeamInfo?.rankingScore
            ? round(eventTeamInfo.rankingScore)
            : '?',
        },
        teamLocation && {
          title: formatTeamLocation(teamLocation, eventKey),
          icon: mdiMapMarker,
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
  )
}

export default EventTeam
