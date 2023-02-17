import Page from '@/components/page'
import { MatchDetailsCard } from '@/components/match-card'
import { useEventInfo } from '@/cache/event-info/use'
import { css } from 'linaria'
import { EventInfoCard } from '@/components/event-info-card'
import Button from '@/components/button'
import { getUpcomingMatches } from '@/utils/upcoming-matches'
import { Heading } from '@/components/heading'
import { EventMatches } from '@/components/event-matches'
import Loader from '@/components/loader'
import { useEventMatches } from '@/cache/event-matches/use'
// import { useCurrentTime } from '@/utils/use-current-time'
import clsx from 'clsx'

interface Props {
  eventKey: string
}

const spacing = '1.5rem'

const eventStyle = css`
  display: grid;
  grid-template-columns: minmax(21rem, 23rem);
  justify-content: center;
  align-items: start;
  grid-gap: ${spacing};
  padding: ${spacing};
  margin-top: 0.5rem;

  @media (min-width: 800px) {
    grid-template-columns: minmax(20rem, 25rem) 21rem;
  }
`

const sectionStyle = css`
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: ${spacing};
`

const headingStyle = css`
  font-size: 1.2rem;
  justify-self: center;
`

const noMatchesStyle = css`
  color: gray;
  text-align: center;
  /* it seemed like there was a little too much space above without this change */
  margin: -0.35rem 0 0;
`

const Event = ({ eventKey }: Props) => {
  const matches = useEventMatches(eventKey)
  const eventInfo = useEventInfo(eventKey)

  // const currentTime = useCurrentTime().getTime()
  const date = new Date(2022, 11, 17, 11)
  const currentTime = date.getTime()
  const upcomingMatches = matches
    ? getUpcomingMatches(matches, currentTime)
    : []

  return (
    <Page
      // name={eventInfo?.name || <code>{eventKey}</code>}
      name={date.toDateString() + ' ' + date.toTimeString()}
      back="/"
      class={eventStyle}
    >
      <div class={sectionStyle}>
        <Heading level={2} class={headingStyle}>
          Information
        </Heading>
        {eventInfo && <EventInfoCard event={eventInfo} />}
        <Button href={`/events/${eventKey}/analysis`}>Analysis</Button>
      </div>

      <div class={sectionStyle}>
        {upcomingMatches.length > 0 ? (
          <>
            <Heading level={2} class={headingStyle}>
              Upcoming Matches
            </Heading>
            <div
              class={css`
                display: grid;
                grid-template-columns: auto;
                grid-gap: 1.1rem;
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
            <Heading
              level={2}
              class={clsx(
                headingStyle,
                css`
                  margin-top: ${spacing};
                `,
              )}
            >
              All Matches
            </Heading>
          </>
        ) : (
          <Heading level={2} class={headingStyle}>
            Matches
          </Heading>
        )}
        {matches ? (
          matches.length > 0 ? (
            <EventMatches matches={matches} eventKey={eventKey} />
          ) : (
            <p class={noMatchesStyle}>No matches yet</p>
          )
        ) : (
          <Loader />
        )}
      </div>
    </Page>
  )
}

export default Event
