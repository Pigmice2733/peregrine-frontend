import { h, Fragment } from 'preact'
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
import { useEventInfo } from '@/cache/event-info/use'
import { usePromise } from '@/utils/use-promise'
import { nextIncompleteMatch } from '@/utils/next-incomplete-match'
import { ChartCard } from '@/components/chart'
import { useEventMatches } from '@/cache/event-matches/use'
import { useState } from 'preact/hooks'
import {
  initSpring,
  Animated,
  Springed,
  tweenColor,
  tweenLength,
  springedObject,
  templateSpring,
  measure,
} from '@/spring/use'
import { useSchema } from '@/cache/schema/use'

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
  const schema = useSchema(eventInfo?.schemaId)
  const teamMatches = useEventMatches(eventKey, 'frc' + teamNum)
  const teamComments = usePromise(
    () => getMatchTeamComments(eventKey, 'frc' + teamNum),
    [eventKey, teamNum],
  )

  const nextMatch = teamMatches && nextIncompleteMatch(teamMatches)

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
      <TestComponent />
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
            action: eventTeamInfo?.rankingScore
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
                  <a href={`/events/${eventKey}/matches/${c.matchKey}`}>
                    {formatMatchKey(c.matchKey).group}
                  </a>
                  : {c.comment}
                </li>
              ))}
          </ul>
        </Card>
      )}
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

export default EventTeam

const TestComponent = () => {
  const [toggle, setToggle] = useState(false)
  const spring = initSpring({ mass: 0.0007 })

  const styles = springedObject({
    padding: '0.5rem',
    'border-radius': '0.2rem',
    // transform: spring(templateSpring`translateX(${toggle ? 200 : -200}px)`),
    'font-family': '"Dank Mono", "Fira Code", "Source Code Pro"',
    // left: spring(templateSpring`${spring(toggle ? 10 : 100)}px`),
    left: toggle ? 0 : '',
    right: toggle ? '' : 0,
    position: 'absolute',
    transform: spring(
      templateSpring`translateX(${measure(elSnapshot => {
        console.log('hi', elSnapshot.offsetLeft)
        return -elSnapshot.offsetLeft
      })}px)`,
    ),
    // background: tweenColor(spring, toggle ? '#282828' : 'black'),
    // color: tweenColor(spring, toggle ? '#b16286' : '#994cc3'),
    // width: tweenLength(spring, toggle ? '20vw' : '100%', el => el.offsetWidth),
    // ...(toggle
    //   ? {
    //       background: tweenColor(spring, '#282828'),
    //       color: tweenColor(spring, '#b16286'),
    //     }
    //   : {
    //       background: tweenColor(spring, 'black'),
    //       color: tweenColor(spring, '#994cc3'),
    //     }),
  })

  return (
    <div
      class={css`
        width: 50vw;
        display: flex;
        flex-direction: column;
        align-items: center;
      `}
    >
      <Animated.pre style={styles}>
        {toggle ? 'hi' : 'hiya long\n\nhi again'}
      </Animated.pre>
      <button onClick={() => setToggle(t => !t)}>clickme</button>
    </div>
  )
}
