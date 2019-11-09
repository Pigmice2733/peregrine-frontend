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

interface Props {
  eventKey: string
  matchKey: string
}

const tableTeamStyle = css``

const redStyle = css``
const blueStyle = css``

const matchStyle = css`
  padding: 0 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;

  & > div, /* increase specificity */
  & > * {
    margin: 1.5rem 0 0 0;
    max-width: 100%;
  }

  /* extra selectors for specificity */
  a.${tableTeamStyle}.${redStyle} {
    color: var(--alliance-red);
  }

  a.${tableTeamStyle}.${blueStyle} {
    color: var(--alliance-blue);
  }
`

const EventMatch = ({ eventKey, matchKey }: Props) => {
  const m = formatMatchKey(matchKey)
  const eventInfo = useEventInfo(eventKey)
  const matchInfo = useMatchInfo(eventKey, matchKey)
  const schema = useSchema(eventInfo?.schemaId)
  const teams = usePromise(() => getEventStats(eventKey), [eventKey])

  return (
    <Page
      back={`/events/${eventKey}`}
      name={
        m.group +
        (m.num ? ' Match ' + m.num : '') +
        ' - ' +
        (eventInfo ? eventInfo.name : eventKey)
      }
    >
      <div class={matchStyle}>
        <Button href={`/events/${eventKey}/matches/${matchKey}/scout`}>
          Scout Match
        </Button>
        {matchInfo ? <MatchCard match={matchInfo} /> : <Spinner />}
        {matchInfo && schema && teams && (
          <AnalysisTable
            teams={teams.filter(
              t =>
                matchInfo.redAlliance.includes('frc' + t.team) ||
                matchInfo.blueAlliance.includes('frc' + t.team),
            )}
            schema={schema}
            renderTeam={team => (
              <a
                class={clsx(
                  tableTeamStyle,
                  matchInfo.redAlliance.includes('frc' + team)
                    ? redStyle
                    : blueStyle,
                )}
                href={`/events/${eventKey}/teams/${team}`}
              >
                {team}
              </a>
            )}
          />
        )}
      </div>
    </Page>
  )
}

export default EventMatch
