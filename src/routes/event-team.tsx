import { h, Fragment, FunctionComponent } from 'preact'
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
import { useEventInfo } from '@/cache/events'
import { usePromise } from '@/utils/use-promise'
import { useEventMatches } from '@/cache/matches'
import { nextIncompleteMatch } from '@/utils/next-incomplete-match'
import { getMatchTeamReports } from '@/api/report/get-match-team-reports'
import { ProcessedMatch } from '@/api/match-info'
import { lerp } from '@/utils/lerp'
import { pigmicePurple } from '@/colors'
import { lighten, darken } from 'polished'
import { useMemo, useState } from 'preact/hooks'
import Button from '@/components/button'

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
  const [field, setField] = useState(true)

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
      {teamMatches && (
        <Fragment>
          <ChartDisplay
            team={'frc' + teamNum}
            eventKey={eventKey}
            teamMatches={teamMatches}
            fieldName={field ? 'Rocket Hatches Lvl 3' : 'Rocket Hatches Lvl 2'}
          />
          <Button onClick={() => setField(f => !f)}>Change Field</Button>
        </Fragment>
      )}
    </Page>
  )
}

interface ChartDisplayProps {
  team: string
  eventKey: string
  teamMatches: ProcessedMatch[]
  fieldName: string
}

const ChartDisplay: FunctionComponent<ChartDisplayProps> = ({
  team,
  eventKey,
  teamMatches,
  fieldName,
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null)
  const matchReports = usePromise(
    () =>
      Promise.all(
        teamMatches.map(async m => {
          const reports = await getMatchTeamReports(eventKey, m.key, team)
          return { ...m, reports }
        }),
      ),
    [team, teamMatches, eventKey],
  )
  const matchesWithReports = (matchReports || [])
    .filter(m => m.reports.length > 0)
    .sort(compareMatches)
  const dataPoints = matchesWithReports
    .map(m => {
      const firstReport = m.reports[0]
      const matchingField = firstReport.data.teleop.find(
        f => f.name === fieldName,
      )
      return matchingField && matchingField.successes
    })
    .filter((m): m is number => typeof m === 'number')

  return (
    dataPoints.length !== 0 && (
      <Card>
        <Chart
          points={dataPoints}
          onPointHover={setHoveredPoint}
          onPointUnHover={() => setHoveredPoint(null)}
        />
        {hoveredPoint === null ? (
          <Fragment>
            <p>Max: {Math.max(...dataPoints)}</p>
            <p>Min: {Math.min(...dataPoints)}</p>
          </Fragment>
        ) : (
          <p>{`${dataPoints[hoveredPoint]} in ${
            formatMatchKey(matchesWithReports[hoveredPoint].key).group
          }`}</p>
        )}
      </Card>
    )
  )
}

interface ChartProps {
  points: number[]
  onPointHover: (index: number) => void
  onPointUnHover: (index: number) => void
}

const baseColor = pigmicePurple

const chartStyle = css`
  min-width: 30rem;
  height: auto;
  background: ${baseColor};
  display: block;
  border-top-right-radius: inherit;
  border-top-left-radius: inherit;
  overflow: visible;
`

const lineStyle = css`
  stroke: ${lighten(0.2, baseColor)};
  stroke-width: 0.03;
  fill: none;
`

const pointStyle = css`
  r: 0.15;
  fill: ${darken(0.05, baseColor)};
  opacity: 0;
  transition: opacity 0.3s ease;
  stroke-width: 0.3;
  cursor: pointer;
  stroke: transparent;

  &:hover {
    opacity: 1;
  }
`

const polygonStyle = css``

let ids = 0

const Chart: FunctionComponent<ChartProps> = ({
  points,
  onPointHover,
  onPointUnHover,
}) => {
  const id = useMemo(() => ids++, [])
  const gradientId = `chartGradient-${id}`
  const shadowId = `chartShadow-${id}`
  const outerClipId = `chartShadowClip-${id}`

  const canvasWidth = points.length - 1
  const canvasHeight = canvasWidth

  const highest = Math.max(...points)
  const lowest = Math.min(...points)

  /**
   * What % of the chart height should be covered by the points height
   */
  const visibleRange = 0.8

  const endPaddingPercent = (1 - visibleRange) / 2
  const endPadding = endPaddingPercent * canvasHeight

  const yLerper = lerp(lowest, highest, endPadding, canvasHeight - endPadding)

  const lerpedPoints = points.map(point => canvasHeight - yLerper(point))

  const linePoints = lerpedPoints.map((y, x) => {
    // the x is the index, they are sequential and evenly spaced
    return `${x},${y}`
  })

  // adds points at bottom left and bottom right
  const polygonPoints = [
    `0,${canvasHeight}`,
    ...linePoints,
    `${canvasWidth},${canvasHeight}`,
  ]

  if (points.length === 0) return null

  return (
    <svg
      class={chartStyle}
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${canvasWidth} ${canvasHeight}`}
      width="1"
      height="1"
    >
      <linearGradient id={gradientId} x1={0} x2={0} y1={0} y2={canvasHeight}>
        <stop offset="0" stop-color={lighten(0.05, baseColor)} />
        <stop offset="1" stop-color={darken(1, baseColor)} />
      </linearGradient>

      <clipPath id={outerClipId}>
        <rect x="0" y="0" width={canvasWidth} height={canvasHeight} />
      </clipPath>

      <filter id={shadowId}>
        <feGaussianBlur in="SourceAlpha" stdDeviation=".8" />
        <feOffset dx="0" dy="0" result="offsetblur" />
        <feComponentTransfer>
          <feFuncA
            type="linear"
            slope="0.17" // Opacity
          />
        </feComponentTransfer>
        <feMerge>
          <feMergeNode />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      <g clip-path={`url(#${outerClipId})`}>
        <polygon
          class={polygonStyle}
          points={polygonPoints.join(' ')}
          fill={`url(#${gradientId})`}
          filter={`url(#${shadowId})`}
        />

        <polyline class={lineStyle} points={linePoints.join(' ')} />
      </g>

      {lerpedPoints.map((y, x) => (
        <circle
          cx={x}
          cy={y}
          class={pointStyle}
          onMouseEnter={() => onPointHover(x)}
          onMouseLeave={onPointUnHover}
        ></circle>
      ))}
    </svg>
  )
}

export default EventTeam
