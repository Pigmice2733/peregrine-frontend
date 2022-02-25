/* eslint-disable caleb/@typescript-eslint/no-unnecessary-condition */
import { h } from 'preact'
import Page from '@/components/page'
import { formatMatchKey } from '@/utils/format-match-key'
import { MatchCard } from '@/components/match-card'
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
import { isData } from '@/utils/is-data'
import Icon from '@/components/icon'
import { alert } from '@/icons/alert'
import { NetworkError } from '@/api/base'

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

  a.${tableTeamStyle}.${redStyle} {
    color: ${red};
  }

  a.${tableTeamStyle}.${blueStyle} {
    color: ${blue};
  }
`

const undefinedMatchStyle = css`
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

// eslint-disable-next-line complexity
const EventMatch = ({ eventKey, matchKey }: Props) => {
  const m = formatMatchKey(matchKey)
  const event = useEventInfo(eventKey)
  const match = useMatchInfo(eventKey, matchKey)
  const schema = useSchema(isData(event) ? event.schemaId : undefined)
  const teams = usePromise(() => getEventStats(eventKey), [eventKey])

  const [selectedDisplay, setSelectedDisplay] = useState<SelectedDisplay>(
    showEventResults,
  )

  const matchHasBeenPlayed =
    isData(match) &&
    match.blueScore !== undefined &&
    match.redScore !== undefined

  // displayed name of the tab, defining here to avoid repeated code
  const pageName =
    (m === null
      ? matchKey + ' - '
      : m.group + (m.num ? ' Match ' + m.num : '') + ' - ') +
    (event ? event.name : eventKey)

  // When the match loads (or changes),
  useEffect(() => {
    if (matchHasBeenPlayed) setSelectedDisplay(showMatchResults)
  }, [matchHasBeenPlayed])

  let teamsStats = usePromise(() => {
    if (isData(match)) {
      return Promise.all(
        [...match.redAlliance, ...match.blueAlliance].map((t) =>
          getMatchTeamStats(eventKey, match.key, t).then(processTeamStats),
        ),
      )
    }
  }, [match])

  // check if the match is unloadable due to an error
  let statsErrorType = 'non-existent'
  if (teamsStats instanceof NetworkError) {
    statsErrorType = 'network'
    teamsStats = undefined
  } else if (teamsStats instanceof Error) {
    statsErrorType = 'other'
    teamsStats = undefined
  }

  // define what to put in the card if the match data can't be loaded
  let matchUndefinedStatement = ''
  switch (statsErrorType) {
    case 'non-existent':
      matchUndefinedStatement =
        m === null
          ? 'This match does not exist.'
          : m.group + (m.num ? ' ' + m.num : '') + ' does not exist.'
      break
    case 'network':
      matchUndefinedStatement =
        m === null
          ? 'Unable to load match.'
          : 'Unable to load ' + m.group + (m.num ? ' ' + m.num : '') + '.'
      break
    case 'other':
      matchUndefinedStatement =
        m === null
          ? 'There was an error loading the match.'
          : 'There was an error loading ' +
            m.group +
            (m.num ? ' ' + m.num : '') +
            '.'
      break
    default:
      matchUndefinedStatement = 'This match cannot be found.'
  }

  if (!isData(match)) {
    return (
      /* if the match doesn't exist */
      <Page back={`/events/${eventKey}`} name={pageName} class={matchStyle}>
        <Card class={undefinedMatchStyle}>
          <Icon icon={alert} />
          <div
            class={css`
              font-size: 2rem;
              text-align: center;
            `}
            /* display text to show that the match doesn't exist */
          >
            {matchUndefinedStatement}
          </div>
          <Button href={`/events/${eventKey}`}> Return to Event Page</Button>
        </Card>
      </Page>
    )
  }

  return (
    <Page /* show match data if the match exists */
      back={`/events/${eventKey}`}
      name={pageName}
      class={matchStyle}
    >
      <Button href={`/events/${eventKey}/matches/${matchKey}/scout`}>
        Scout Match
      </Button>
      <MatchCard match={match} eventKey={eventKey} />
      {matchHasBeenPlayed && (
        <Card class={matchScoreStyle}>
          <div class={redScoreStyle}>{match.redScore}</div>
          <div class={blueScoreStyle}>{match.blueScore}</div>
        </Card>
      )}
      {schema && (
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
              isData(teams) && selectedDisplay === showEventResults
                ? teams.filter((t: { team: string }) =>
                    matchHasTeam('frc' + t.team)(match),
                  )
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
      {match.videos?.map((v) => (
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
