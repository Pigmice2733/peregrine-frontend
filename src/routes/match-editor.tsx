import { createEventMatch } from '@/api/match-info/create-event-match'
import { useMatchInfo } from '@/cache/match-info/use'
import Button from '@/components/button'
import Card from '@/components/card'
import { useErrorEmitter, ErrorBoundary } from '@/components/error-boundary'
import { Form } from '@/components/form'
import Page from '@/components/page'
import TextInput from '@/components/text-input'
import { route } from '@/router'
import {
  getTimeFromParts,
  formatDate,
  formatTime,
} from '@/utils/get-time-from-parts'
import { css } from 'linaria'
import { useState } from 'preact/hooks'

const cardStyle = css`
  margin: 1.5rem;
  padding: 1.5rem 2rem;
  width: 20rem;
  margin-left: auto;
  margin-right: auto;
  & > * {
    margin-left: 0;
    margin-right: 0;
  }
`

const EditorForm = ({
  eventKey,
  matchKey,
}: {
  eventKey: string
  matchKey: string
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [day, setDay] = useState('')
  const [time, setTime] = useState('')
  const [teamList, setTeamList] = useState([''])
  const [redScore, setRedScore] = useState(0)
  const [blueScore, setBlueScore] = useState(0)
  const emitError = useErrorEmitter()
  const match = useMatchInfo(eventKey, matchKey)
  const matchDate = match?.time || new Date(Date.now())

  const formatTeams = () => {
    let output = ''
    match?.redAlliance.forEach((team) => {
      output += team.slice(3) + ', '
    })
    match?.blueAlliance.forEach((team) => {
      output += team.slice(3) + ', '
    })
    return output.slice(0, -2)
  }

  const onSubmit = (e: Event) => {
    e.preventDefault()
    setIsLoading(true)
    createEventMatch(eventKey, {
      redAlliance: teamList.slice(0, 3),
      blueAlliance: teamList.slice(3, 6),
      time: getTimeFromParts(day, time),
      key: matchKey,
      redScore,
      blueScore,
      videos: match?.videos,
      scheduledTime: match?.scheduledTime?.toISOString(),
    })
      .then(() => route(`/events/${eventKey}/matches/${matchKey}`))
      .catch(emitError)
      .finally(() => setIsLoading(false))
  }

  return (
    <Form onSubmit={onSubmit}>
      {(isValid) => (
        <>
          <TextInput
            label="Date (in mm/dd format) or leave blank for current date"
            onInput={setDay}
            placeholder={formatDate(matchDate)}
          />
          <TextInput
            label="Time (in hh:mm format) or leave blank for current time"
            onInput={setTime}
            placeholder={formatTime(matchDate)}
          />
          <TextInput
            label="Teams (separate numbers with commas and spaces, red alliance first)"
            required
            onInput={(input) => {
              const teams = input.split(', ')
              for (let i = 0; i < teams.length; i++) {
                teams[i] = 'frc' + teams[i]
              }
              setTeamList(teams)
            }}
            placeholder={formatTeams()}
          />
          <TextInput
            label="Red Alliance Score"
            onInput={(input) => setRedScore(Number.parseInt(input))}
            placeholder={match?.redScore?.toString() || '0'}
          />
          <TextInput
            label="Blue Alliance Score"
            onInput={(input) => setBlueScore(Number.parseInt(input))}
            placeholder={match?.blueScore?.toString() || '0'}
          />
          <Button disabled={isLoading || !isValid}>
            {isLoading ? 'Saving Match Information' : 'Save Match'}
          </Button>
        </>
      )}
    </Form>
  )
}

const MatchEditor = ({
  eventKey,
  matchKey,
}: {
  eventKey: string
  matchKey: string
}) => (
  <Page name={'Edit Match'} back={`/events/${eventKey}/matches/${matchKey}`}>
    <Card class={cardStyle}>
      <ErrorBoundary>
        <EditorForm eventKey={eventKey} matchKey={matchKey} />
      </ErrorBoundary>
    </Card>
  </Page>
)

export default MatchEditor
