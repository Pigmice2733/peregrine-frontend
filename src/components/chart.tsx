import { ProcessedMatchInfo } from '@/api/match-info'
import { FunctionComponent, h, Fragment, JSX } from 'preact'
import { useState, useEffect, useRef } from 'preact/hooks'
import { usePromise } from '@/utils/use-promise'
import { compareMatches } from '@/utils/compare-matches'
import Card from './card'
import {
  pigmicePurple,
  gray,
  greenOnPurple,
  redOnPurple,
  focusRing,
} from '@/colors'
import { css } from 'linaria'
import { lighten, darken } from 'polished'
import { lerp } from '@/utils/lerp'
import { getMatchTeamStats } from '@/api/stats/get-match-team-stats'
import { round } from '@/utils/round'
import { Dropdown } from './dropdown'
import { Schema } from '@/api/schema'
import { memo } from '@/utils/memo'
import { useQueryState } from '@/utils/use-query-state'
import { formatPercent } from '@/utils/format-percent'
import clsx from 'clsx'
import { Merge } from '@/type-utils'
import Icon from './icon'
import { checkBold } from '@/icons/check-bold'
import { xBold } from '@/icons/x-bold'
import { formatMatchKeyShort } from '@/utils/format-match-key-short'

interface ChartCardProps {
  team: string
  eventKey: string
  teamMatches: ProcessedMatchInfo[]
  schema: Schema
}

const average = (values: number[]) =>
  values.reduce((sum, val) => sum + val) / values.length

const chartCardStyle = css``

const chartDescriptionStyle = css`
  display: grid;
  grid-template-columns: 1fr auto;
  padding: 1.2rem;
`

const statPickerStyle = css`
  grid-column: 2;
  grid-row: 1;
  margin: 0;
  align-self: start;
  font-size: 1.1rem;
`

export const ChartCard: FunctionComponent<ChartCardProps> = ({
  team,
  eventKey,
  teamMatches,
  schema,
}) => {
  const [fieldName, setFieldName] = useQueryState('stat', schema.schema[0].name)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
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

  useEffect(() => setSelectedIndex(null), [fieldName])

  const matchesWithSelectedStat = matchesStats
    .map(({ matchKey, stats }) => {
      const matchingStat = stats.find(f => f.name === fieldName)
      if (matchingStat) return { matchKey, matchingStat }
      return null
    })
    .filter((f): f is Exclude<typeof f, null> => f !== null)

  const dataPoints = matchesWithSelectedStat.map(s => s.matchingStat.avg)

  const hoveredMatchKey =
    selectedIndex !== null && matchesWithSelectedStat[selectedIndex].matchKey

  const handleClick = (event: MouseEvent) => {
    if (
      !(event.target as Element).closest(
        `.${pointStyle},.${booleanDisplayStyle}`,
      )
    )
      setSelectedIndex(null)
  }

  const statOptions = schema.schema
    .filter(stat => !stat.hide)
    .map(stat => stat.name)

  const matchingSchemaStat = schema.schema.find(s => s.name === fieldName)
  const isBooleanStat =
    matchingSchemaStat && matchingSchemaStat.type === 'boolean'

  return dataPoints.length === 0 ? null : (
    <Card onClick={handleClick} class={chartCardStyle}>
      {isBooleanStat ? (
        <BooleanChart points={dataPoints} onPointClick={setSelectedIndex} />
      ) : (
        <Chart points={dataPoints} onPointClick={setSelectedIndex} />
      )}
      <div class={chartDescriptionStyle}>
        <Dropdown
          class={statPickerStyle}
          options={statOptions}
          onChange={setFieldName}
          value={fieldName}
        />
        <div class={detailsStyle}>
          {selectedIndex === null ? (
            isBooleanStat ? (
              <p>{formatPercent(average(dataPoints))}</p>
            ) : (
              <dl>
                <dt>Max</dt> <dd>{round(Math.max(...dataPoints))}</dd>
                <dt>Avg</dt> <dd>{round(average(dataPoints))}</dd>
                <dt>Min</dt> <dd>{round(Math.min(...dataPoints))}</dd>
              </dl>
            )
          ) : (
            <p>
              {isBooleanStat ? (
                <BooleanDisplay value={Boolean(dataPoints[selectedIndex])} />
              ) : (
                dataPoints[selectedIndex]
              )}
              {' in '}
              <a
                href={`/events/${eventKey}/matches/${matchesWithSelectedStat[selectedIndex].matchKey}`}
              >
                {formatMatchKeyShort(hoveredMatchKey as string)}
              </a>
            </p>
          )}
        </div>
      </div>
    </Card>
  )
}

const baseColor = pigmicePurple

const chartStyle = css`
  width: 24rem;
  max-width: 100%;
  height: auto;
  background: ${baseColor};
  display: block;
  border-top-right-radius: inherit;
  border-top-left-radius: inherit;
  overflow: visible;
`

const lineWidth = 0.4

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
  font-size: 3.1px;
  /* Scoot it over so it isn't touching the edge of the chart */
  transform: translateX(-1.2px);
  fill: ${lighten(0.7, baseColor)};
  text-anchor: end;
  dominant-baseline: middle;
`

const pointStyle = css`
  r: 2;
  -webkit-tap-highlight-color: transparent;
  fill: ${darken(0.05, baseColor)};
  opacity: 0;
  transition: opacity 0.3s ease;
  stroke-width: 10;
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
  onPointClick: (index: number) => void
}

const Chart: FunctionComponent<ChartProps> = memo(
  ({ points, onPointClick }) => {
    const [id] = useState(ids++)
    const gradientId = `chartGradient-${id}`
    const shadowId = `chartShadow-${id}`
    const outerClipId = `chartShadowClip-${id}`

    /**
     * How "wide" the canvas is, because it gets scaled up
     * This is arbitrary. It determines the "zoom" of the graph
     */
    const canvasWidth = 100
    const canvasHeight = canvasWidth

    const highest = Math.max(...points)
    const lowest = Math.min(...points)

    /** What % of the chart height should be covered by the points vertically */
    const visibleRange = 0.85

    const endPaddingPercent = (1 - visibleRange) / 2
    const endPadding = endPaddingPercent * canvasHeight

    const yLerper = lerp(lowest, highest, endPadding, canvasHeight - endPadding)
    const xLerper = lerp(0, points.length - 1, 0, canvasWidth)

    /** Whether the value for the field never changes */
    const isConstant = highest === lowest

    const lerpedPoints = points.map(point =>
      isConstant ? canvasHeight / 2 : canvasHeight - yLerper(point),
    )

    const linePoints = lerpedPoints.map(
      (y, x) => `${xLerper(x)},${y}`, // the x is the array index, they are sequential and evenly spaced
    )

    const averageYValue = canvasHeight - yLerper(average(points))

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
        <linearGradient id={gradientId} x1={0} x2={0} y1={0} y2={1}>
          <stop offset={0} stop-color={lighten(0.05, baseColor)} />
          <stop offset={1} stop-color={baseColor} />
        </linearGradient>

        <clipPath id={outerClipId}>
          <rect x="0" y="0" width={canvasWidth} height={canvasHeight} />
        </clipPath>

        <filter id={shadowId}>
          <feGaussianBlur in="SourceAlpha" stdDeviation="11" />
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

        {isConstant ? (
          <text x={canvasWidth} y={canvasHeight / 2} class={boundsTextStyle}>
            {points[0]}
          </text>
        ) : (
          <Fragment>
            <line
              x1={0}
              x2={canvasWidth}
              y1={endPadding}
              y2={endPadding}
              class={boundsLineStyle}
            />
            <text x={canvasWidth} y={endPadding} class={boundsTextStyle}>
              {round(Math.max(...points))}
            </text>

            <line
              x1={0}
              x2={canvasWidth}
              y1={averageYValue}
              y2={averageYValue}
              class={boundsLineStyle}
              stroke-dasharray="1.1"
            />
            <text x={canvasWidth} y={averageYValue} class={boundsTextStyle}>
              Avg: {round(average(points))}
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
              {round(Math.min(...points))}
            </text>
          </Fragment>
        )}

        {lerpedPoints.map((y, x) => (
          <circle
            key={x} // eslint-disable-line caleb/react/no-array-index-key
            cx={xLerper(x)}
            cy={y}
            class={pointStyle}
            onClick={() => onPointClick(x)}
          />
        ))}
      </svg>
    )
  },
)

const overflowLeftStyle = css``
const overflowRightStyle = css``

const booleanChartStyle = css`
  background: ${baseColor};
  height: 5rem;
  border-top-left-radius: inherit;
  border-top-right-radius: inherit;
  max-width: 27rem;
  width: 25rem;
  overflow: auto;
  position: relative;
  scrollbar-width: none;
  display: flex;

  &::before,
  &::after {
    border-radius: inherit;
    content: '';
    display: block;
    position: fixed;
    width: inherit;
    height: inherit;
    max-width: inherit;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  &::before {
    background: linear-gradient(90deg, transparent 80%, #630063c4);
  }

  &.${overflowRightStyle}::before {
    opacity: 1;
  }

  &::after {
    background: linear-gradient(-90deg, transparent 80%, #630063c4);
  }
  &.${overflowLeftStyle}::after {
    opacity: 1;
  }

  &::-webkit-scrollbar {
    width: 0;
  }
`

const innerBooleanChartStyle = css`
  display: grid;
  grid-auto-flow: column;
  grid-gap: 0.4rem;
  align-content: center;
  flex-grow: 1;
  justify-content: center;

  /* Empty before and after children so grid gap gets applied at both ends */
  /* This is the easiest way to get a margin to apply to the right side of a horizontally scrolling container */
  &::before,
  &::after {
    content: '';
  }
`

const booleanDisplayStyle = css`
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  border: none;
  outline: none;
  color: white;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  padding: 0.3rem;

  button& {
    cursor: pointer;
  }

  &:focus {
    box-shadow: 0 0 0 0.25rem ${focusRing};
  }
`

const trueStyle = css`
  background: ${greenOnPurple};
`

const falseStyle = css`
  background: ${redOnPurple};
`

const BooleanDisplay: FunctionComponent<
  Merge<JSX.HTMLAttributes, { value: boolean }>
> = ({ value, ...props }) => {
  const El = props.onClick ? 'button' : 'div'
  return (
    <El
      {...props}
      class={clsx(
        booleanDisplayStyle,
        value ? trueStyle : falseStyle,
        props.class,
      )}
    >
      <Icon icon={value ? checkBold : xBold} />
    </El>
  )
}

/** The amount that can be scrolled before the gradient appears */
const scrollThreshold = 5

const BooleanChart: FunctionComponent<ChartProps> = ({
  points,
  onPointClick,
}) => {
  const elementRef = useRef<HTMLElement>()
  const [isOverflowingLeft, setIsOverflowingLeft] = useState<boolean>(false)
  const [isOverflowingRight, setIsOverflowingRight] = useState<boolean>(false)

  const recomputeScrolling = () => {
    const element = elementRef.current
    if (!element) return
    setIsOverflowingLeft(element.scrollLeft > scrollThreshold)
    setIsOverflowingRight(
      element.scrollWidth - element.scrollLeft - element.clientWidth >
        scrollThreshold,
    )
  }

  useEffect(recomputeScrolling, [])

  return (
    <div
      class={clsx(
        booleanChartStyle,
        isOverflowingLeft && overflowLeftStyle,
        isOverflowingRight && overflowRightStyle,
      )}
      ref={elementRef}
      onScroll={recomputeScrolling}
    >
      <div class={innerBooleanChartStyle}>
        {points.map((p, i) => (
          <BooleanDisplay
            key={i} // eslint-disable-line caleb/react/no-array-index-key
            value={Boolean(p)}
            onClick={() => onPointClick(i)}
          />
        ))}
      </div>
    </div>
  )
}

const detailsStyle = css`
  height: 4rem;
  grid-column: 1;
  grid-row: 1;
  align-self: stretch;
  display: flex;
  justify-content: space-between;
  flex-direction: column;

  & p .${booleanDisplayStyle} {
    width: 1.2rem;
    height: 1.2rem;
  }

  & p,
  & dl,
  & dd {
    margin: 0;
  }

  & dt,
  & dd {
    font-family: 'Roboto Condensed', 'Roboto', sans-serif;
    text-transform: uppercase;
    font-size: 0.85rem;
  }

  & dd {
    font-weight: bold;
  }

  & dt {
    color: ${gray};
  }

  dl {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-gap: 0.5rem;
    height: 100%;
    align-content: space-between;
  }
`
