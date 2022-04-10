import Page from '@/components/page'
import { MatchDetailsCard } from '@/components/match-card'
import { useEventInfo } from '@/cache/event-info/use'
import { css } from 'linaria'
import { EventInfoCard } from '@/components/event-info-card'
import Button from '@/components/button'
import { NextMatchIndex } from '@/utils/next-incomplete-match'
import { Heading } from '@/components/heading'
import { EventMatches } from '@/components/event-matches'
import Loader from '@/components/loader'
import { useEventMatches } from '@/cache/event-matches/use'

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
  grid-template-columns: auto;
  grid-gap: 2.5rem;
`

const upcomingMatchesStyle = css`
  display: grid;
  grid-template-columns: auto;
  grid-template-areas:
    'header'
    'upcomingMatches'
    'allMatches';
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
  const newestIncompleteMatch = matches && NextMatchIndex(matches)
  const newestIndex = newestIncompleteMatch?.index
    ? newestIncompleteMatch.index
    : -3
  const secondLastMatch = matches?.[newestIndex - 2]
  const lastMatch = matches?.[newestIndex - 1]
  const nextMatch = matches?.[newestIndex + 1]
  const secondNextMatch = matches?.[newestIndex + 2]

  return (
    <Page
      name={eventInfo?.name || <code>{eventKey}</code>}
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

      <div class={newestIncompleteMatch ? upcomingMatchesStyle : sectionStyle}>
        <Heading
          level={2}
          class={
            headingStyle +
            css`
              grid-area: header;
            `
          }
        >
          {newestIncompleteMatch ? 'Upcoming Matches' : 'Matches'}
        </Heading>
        {secondLastMatch &&
          lastMatch &&
          newestIncompleteMatch &&
          nextMatch &&
          secondNextMatch && (
            <div
              class={css`
                display: grid;
                grid-area: upcomingMatches;
                grid-template-columns: auto;
                grid-gap: 1.1rem;
              `}
            >
              <MatchDetailsCard
                key={secondLastMatch.key}
                match={secondLastMatch}
                eventKey={eventKey}
                link
              />
              <MatchDetailsCard
                key={lastMatch.key}
                match={lastMatch}
                eventKey={eventKey}
                link
              />
              <MatchDetailsCard
                key={newestIncompleteMatch.key}
                match={newestIncompleteMatch}
                eventKey={eventKey}
                link
              />
              <MatchDetailsCard
                key={nextMatch.key}
                match={nextMatch}
                eventKey={eventKey}
                link
              />
              <MatchDetailsCard
                key={secondNextMatch.key}
                match={secondNextMatch}
                eventKey={eventKey}
                link
              />
            </div>
          )}
        <div
          class={css`
            grid-area: allMatches;
          `}
        >
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
      </div>
    </Page>
  )
}

export default Event
