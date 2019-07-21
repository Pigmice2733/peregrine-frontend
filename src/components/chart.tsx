import { ProcessedMatch } from '@/api/match-info'
import { FunctionComponent, h } from 'preact'
import { useState } from 'preact/hooks'
import { usePromise } from '@/utils/use-promise'
import { getMatchTeamReports } from '@/api/report/get-match-team-reports'
import { compareMatches } from '@/utils/compare-matches'
import Card from './card'
import { formatMatchKey } from '@/utils/format-match-key'
import { pigmicePurple } from '@/colors'
import { css } from 'linaria'
import { lighten, darken } from 'polished'
import { lerp } from '@/utils/lerp'

interface ChartDisplayProps {
  team: string
  eventKey: string
  teamMatches: ProcessedMatch[]
  fieldName: string
}

export const ChartDisplay: FunctionComponent<ChartDisplayProps> = ({
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

  return dataPoints.length === 0 ? null : (
    <Card>
      <Chart
        points={dataPoints}
        onPointHover={setHoveredPoint}
        onPointUnHover={() => setHoveredPoint(null)}
      />
      <div class={``}>
        <p>Max: {Math.max(...dataPoints)}</p>
        <p>Min: {Math.min(...dataPoints)}</p>
        {hoveredPoint && (
          <p>{`${dataPoints[hoveredPoint]} in ${
            formatMatchKey(matchesWithReports[hoveredPoint].key).group
          }`}</p>
        )}
      </div>
    </Card>
  )
}

interface ChartProps {
  points: number[]
  onPointHover: (index: number) => void
  onPointUnHover: (index: number) => void
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

const lineStyle = css`
  stroke: ${lighten(0.2, baseColor)};
  stroke-width: 0.03;
  fill: none;
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

const Chart: FunctionComponent<ChartProps> = ({
  points,
  onPointHover,
  onPointUnHover,
}) => {
  const [id] = useState(ids++)
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
          key={x}
          cx={x}
          cy={y}
          class={pointStyle}
          onMouseEnter={() => onPointHover(x)}
          onMouseLeave={onPointUnHover}
        />
      ))}
    </svg>
  )
}
