import { h } from 'preact'
import Page from '@/components/page'
import { formatMatchKey } from '@/utils/format-match-key'
import { MatchCard } from '@/components/match-card'
import Spinner from '@/components/spinner'
import Button from '@/components/button'
import AnalysisTable from '@/components/analysis-table'
import { getEventStats } from '@/api/stats/get-event-stats'
import clsx from 'clsx'
import { useEventInfo } from '@/cache/event-info/use'
import { css } from 'linaria'
import { usePromise } from '@/utils/use-promise'
import { useMatchInfo } from '@/cache/match-info/use'
import { useSchema } from '@/cache/schema/use'
import { useState, useEffect } from 'preact/hooks'
import Card from '@/components/card'
import { red, blue, faintGrey, pigmicePurple } from '@/colors'
import { getMatchTeamStats } from '@/api/stats/get-match-team-stats'
import { processTeamStats } from '@/api/stats'
import { BooleanDisplay } from '@/components/boolean-display'
import { matchHasTeam } from '@/utils/match-has-team'
import { VideoCard } from '@/components/video-card'
import { cleanYoutubeUrl } from '@/utils/clean-youtube-url'

interface Props {
  eventKey: string
  matchKey: string
}

const tableTeamStyle = css``

const redStyle = css``
const blueStyle = css``

const matchStyle = css`
  display: grid;
  max-width: 100%;
  grid-template-columns: 100%;
  padding: 1.5rem;
  grid-gap: 1.5rem;
  justify-items: center;

  & > * {
    max-width: 100%;
    overflow-x: auto;
  }

  /* extra selectors for specificity */
  a.${tableTeamStyle}.${redStyle} {
    color: ${red};
  }

  a.${tableTeamStyle}.${blueStyle} {
    color: ${blue};
  }
`

const showMatchResults = 'Match Results'
const showEventResults = 'Event Results'

type SelectedDisplay = typeof showMatchResults | typeof showEventResults

const EventMatch = ({ eventKey, matchKey }: Props) => {
  const m = formatMatchKey(matchKey)
  const event = useEventInfo(eventKey)
  const match = useMatchInfo(eventKey, matchKey)
  const schema = useSchema(event?.schemaId)
  const teams = usePromise(() => getEventStats(eventKey), [eventKey])

  const [selectedDisplay, setSelectedDisplay] = useState<SelectedDisplay>(
    showEventResults,
  )

  const matchHasBeenPlayed =
    match?.blueScore !== undefined && match.redScore !== undefined

  // When the match loads (or changes),
  useEffect(() => {
    if (matchHasBeenPlayed) setSelectedDisplay(showMatchResults)
  }, [matchHasBeenPlayed])

  const teamsStats = usePromise(
    () =>
      match &&
      Promise.all(
        [...match.redAlliance, ...match.blueAlliance].map((t) =>
          getMatchTeamStats(eventKey, match.key, t).then(processTeamStats),
        ),
      ),
    [match],
  )

  return (
    <Page
      back={`/events/${eventKey}`}
      name={
        m.group +
        (m.num ? ' Match ' + m.num : '') +
        ' - ' +
        (event ? event.name : eventKey)
      }
      class={matchStyle}
    >
      <Button href={`/events/${eventKey}/matches/${matchKey}/scout`}>
        Scout Match
      </Button>
      {match ? <MatchCard match={match} eventKey={eventKey} /> : <Spinner />}
      {match && matchHasBeenPlayed && (
        <Card class={matchScoreStyle}>
          <div class={redScoreStyle}>{match.redScore}</div>
          <div class={blueScoreStyle}>{match.blueScore}</div>
        </Card>
      )}
      {match && schema && (
        <Card
          class={css`
            overflow-y: hidden;
          `}
        >
          <div class={displayModeSelectorStyle}>
            <button
              class={clsx(
                selectedDisplay === showMatchResults && activeDisplayModeStyle,
              )}
              onClick={() => setSelectedDisplay(showMatchResults)}
            >
              {showMatchResults}
            </button>
            <button
              class={clsx(
                selectedDisplay === showEventResults && activeDisplayModeStyle,
              )}
              onClick={() => setSelectedDisplay(showEventResults)}
            >
              {showEventResults}
            </button>
          </div>
          <AnalysisTable
            eventKey={eventKey}
            teams={
              selectedDisplay === showEventResults
                ? teams?.filter((t) => matchHasTeam('frc' + t.team)(match))
                : teamsStats
            }
            schema={schema}
            renderTeam={(team, link) => (
              <a
                class={clsx(
                  tableTeamStyle,
                  match.redAlliance.includes('frc' + team)
                    ? redStyle
                    : blueStyle,
                )}
                href={link}
              >
                {team}
              </a>
            )}
            renderBoolean={
              selectedDisplay === showMatchResults
                ? (cell) => <BooleanDisplay value={cell.avg === 1} />
                : undefined
            }
            enableSettings={selectedDisplay !== showMatchResults}
          />
        </Card>
      )}
      {match?.videos?.map((v) => (
        <VideoCard key={v} url={cleanYoutubeUrl(v)} />
      ))}
    </Page>
  )
}

const matchScoreStyle = css`
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-width: 11rem;
  font-weight: bold;
  justify-content: center;
  text-align: center;
  font-size: 1.5rem;

  & > * {
    padding: 1.5rem 0;
    color: white;
  }
`

const redScoreStyle = css`
  background: ${red};
`
const blueScoreStyle = css`
  background: ${blue};
`

const activeDisplayModeStyle = css``

const displayModeSelectorStyle = css`
  position: sticky;
  left: 0;
  & > button {
    background: transparent;
    padding: 1rem;
    border: none;
    font-weight: bold;
    outline: none;
    cursor: pointer;

    &:hover,
    &:focus {
      background: ${faintGrey};
    }

    &.${activeDisplayModeStyle} {
      box-shadow: inset 0 -0.15rem ${pigmicePurple};
    }
  }
`

export default EventMatch
