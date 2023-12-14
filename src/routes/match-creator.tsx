import { createEventMatch } from '@/api/match-info/create-event-match'
import Button from '@/components/button'
import Card from '@/components/card'
import { useErrorEmitter, ErrorBoundary } from '@/components/error-boundary'
import { Form } from '@/components/form'
import Page from '@/components/page'
import TextInput from '@/components/text-input'
import { route } from '@/router'
import { getTimeFromParts } from '@/utils/get-time-from-parts'
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

const CreatorForm = ({ eventKey }: { eventKey: string }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [matchNumber, setMatchNumber] = useState('')
  const [day, setDay] = useState('')
  const [time, setTime] = useState('')
  const [redScore, setRedScore] = useState(0)
  const [blueScore, setBlueScore] = useState(0)
  const [teamList, setTeamList] = useState([''])
  const emitError = useErrorEmitter()

  const onSubmit = (e: Event) => {
    e.preventDefault()
    setIsLoading(true)
    createEventMatch(eventKey, {
      redAlliance: teamList.slice(0, 3),
      blueAlliance: teamList.slice(3, 6),
      time: getTimeFromParts(day, time),
      redScore,
      blueScore,
      key: `qm${matchNumber}`,
    })
      .then(() => route(`/events/${eventKey}/matches/qm${matchNumber}`))
      .catch(emitError)
      .finally(() => setIsLoading(false))
  }

  return (
    <Form onSubmit={onSubmit}>
      {(isValid) => (
        <>
          <TextInput label="Match Number" onInput={setMatchNumber} required />
          <TextInput
            label="Date (in mm/dd format) or leave blank for today"
            onInput={setDay}
          />
          <TextInput
            label="Time (in hh:mm format) or leave blank for current time"
            onInput={setTime}
          />
          <TextInput
            label="Teams (separate numbers with commas, red alliance first)"
            required
            onInput={(input) => {
              const teams = input.split(', ')
              for (let i = 0; i < teams.length; i++) {
                teams[i] = 'frc' + teams[i]
              }
              setTeamList(teams)
            }}
          />
          <TextInput
            label="Red Alliance Score"
            onInput={(input) => setRedScore(Number.parseInt(input))}
          />
          <TextInput
            label="Blue Alliance Score"
            onInput={(input) => setBlueScore(Number.parseInt(input))}
          />
          <Button disabled={isLoading || !isValid}>
            {isLoading ? 'Saving Match Information' : 'Save Match'}
          </Button>
        </>
      )}
    </Form>
  )
}

const MatchCreator = ({ eventKey }: { eventKey: string }) => (
  <Page name={'Create Match'} back={`/events/${eventKey}`}>
    <Card class={cardStyle}>
      <ErrorBoundary>
        <CreatorForm eventKey={eventKey} />
      </ErrorBoundary>
    </Card>
  </Page>
)

export default MatchCreator
