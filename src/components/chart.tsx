import { ProcessedMatchInfo } from '@/api/match-info'
import { FunctionComponent, h } from 'preact'
import { useState } from 'preact/hooks'
import { usePromise } from '@/utils/use-promise'
import { compareMatches } from '@/utils/compare-matches'
import Card from './card'
import { formatMatchKey } from '@/utils/format-match-key'
import { pigmicePurple } from '@/colors'
import { css } from 'linaria'
import { lighten, darken } from 'polished'
import { lerp } from '@/utils/lerp'
import { getMatchTeamStats } from '@/api/stats/get-match-team-stats'

interface ChartDisplayProps {
  team: string
  eventKey: string
  teamMatches: ProcessedMatchInfo[]
  fieldName: string
}

export const ChartCard: FunctionComponent<ChartDisplayProps> = ({
  team,
  eventKey,
  teamMatches,
  fieldName,
}) => {
  const [hoveredIndex, setHoveredPoint] = useState<number | null>(null)
  const matchesStats =
    usePromise(
      () =>
        Promise.all(
          teamMatches.sort(compareMatches).map(async match => ({
            matchKey: match.key,
            stats: await getMatchTeamStats(eventKey, match.key, team)
              .then(s => s.summary || [])
              .catch(() => []),
          })),
        ),
      [team, teamMatches, eventKey],
    ) || []

  const matchesWithSelectedStat = matchesStats
    .map(({ matchKey, stats }) => {
      const matchingStat = stats.find(f => f.name === fieldName)
      if (matchingStat) return { matchKey, matchingStat }
      return null
    })
    .filter((f): f is Exclude<typeof f, null> => f !== null)

  const dataPoints = matchesWithSelectedStat.map(s => s.matchingStat.avg)

  console.log(dataPoints)

  const hoveredMatchKey =
    hoveredIndex !== null && matchesWithSelectedStat[hoveredIndex].matchKey

  return dataPoints.length === 0 ? null : (
    <Card>
      <Chart
        points={dataPoints}
        onPointHover={setHoveredPoint}
        onPointUnHover={() => setHoveredPoint(null)}
        pointLink={index =>
          `/events/${eventKey}/matches/${matchesWithSelectedStat[index].matchKey}`
        }
      />
      <div>
        <p>Max: {Math.max(...dataPoints)}</p>
        <p>Min: {Math.min(...dataPoints)}</p>
        <h1>{fieldName}</h1>
        {hoveredIndex && (
          <p>
            {`${dataPoints[hoveredIndex]} in ${
              formatMatchKey(hoveredMatchKey as string).group
            }`}
          </p>
        )}
      </div>
    </Card>
  )
}

const baseColor = pigmicePurple

const chartStyle = css`
  width: 30rem;
  max-width: 100%;
  height: auto;
  background: ${baseColor};
  display: block;
  border-top-right-radius: inherit;
  border-top-left-radius: inherit;
  overflow: visible;
`

const lineWidth = 0.03

const lineStyle = css`
  stroke: ${lighten(0.2, baseColor)};
  stroke-width: ${lineWidth};
  fill: none;
`

const boundsLineStyle = css`
  stroke: rgba(256, 256, 256, 0.1);
  stroke-width: ${lineWidth * 0.75};
`

const boundsTextStyle = css`
  font-size: 0.2px;
  /* Center it on the line vertically, and scoot it back over so it doesn't run off the edge of the chart */
  transform: translate(-0.07px, 0.1px);
  fill: ${lighten(0.7, baseColor)};
  text-anchor: end;
`

const pointStyle = css`
  r: 0.15;
  -webkit-tap-highlight-color: transparent;
  fill: ${darken(0.05, baseColor)};
  opacity: 0;
  transition: opacity 0.3s ease;
  stroke-width: 1;
  cursor: pointer;
  stroke: transparent;

  &:hover {
    opacity: 1;
  }
`

const polygonStyle = css``

let ids = 0

interface ChartProps {
  points: number[]
  onPointHover: (index: number) => void
  onPointUnHover: () => void
  pointLink: (index: number) => string
}

const Chart: FunctionComponent<ChartProps> = ({
  points,
  onPointHover,
  onPointUnHover,
  pointLink,
}) => {
  const [id] = useState(ids++)
  const gradientId = `chartGradient-${id}`
  const shadowId = `chartShadow-${id}`
  const outerClipId = `chartShadowClip-${id}`

  /**
   * How "wide" the canvas is, because it gets scaled up
   * This is arbitrary. It determines the "zoom" of the graph
   */
  const canvasWidth = 7
  const canvasHeight = canvasWidth

  const highest = Math.max(...points)
  const lowest = Math.min(...points)

  /** What % of the chart height should be covered by the points vertically */
  const visibleRange = 0.85

  const endPaddingPercent = (1 - visibleRange) / 2
  const endPadding = endPaddingPercent * canvasHeight

  const yLerper = lerp(lowest, highest, endPadding, canvasHeight - endPadding)
  const xLerper = lerp(0, points.length - 1, 0, canvasWidth)

  const lerpedPoints = points.map(point => canvasHeight - yLerper(point))

  const linePoints = lerpedPoints.map((y, x) => {
    // the x is the index, they are sequential and evenly spaced
    return `${xLerper(x)},${y}`
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

      <line
        x1={0}
        x2={canvasWidth}
        y1={endPadding}
        y2={endPadding}
        class={boundsLineStyle}
      />
      <text x={canvasWidth} y={endPadding} class={boundsTextStyle}>
        {Math.max(...points)}
      </text>

      <line
        x1={0}
        x2={canvasWidth}
        y1={canvasHeight - endPadding}
        y2={canvasHeight - endPadding}
        class={boundsLineStyle}
      />
      <text
        x={canvasWidth}
        y={canvasHeight - endPadding}
        class={boundsTextStyle}
      >
        {Math.min(...points)}
      </text>

      {lerpedPoints.map((y, x) => (
        // eslint-disable-next-line caleb/react/no-array-index-key
        <a href={pointLink(x)} key={x}>
          <circle
            cx={xLerper(x)}
            cy={y}
            class={pointStyle}
            onMouseEnter={() => onPointHover(x)}
            onMouseLeave={onPointUnHover}
          />
        </a>
      ))}
    </svg>
  )
}
