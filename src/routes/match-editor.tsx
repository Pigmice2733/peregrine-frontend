import { createEventMatch } from '@/api/match-info/create-event-match'
import Button from '@/components/button'
import Card from '@/components/card'
import { useErrorEmitter, ErrorBoundary } from '@/components/error-boundary'
import { Form } from '@/components/form'
import Page from '@/components/page'
import TextInput from '@/components/text-input'
import { route } from '@/router'
import { getTimeFromParts } from '@/utils/use-time-from-parts'
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

const EditorForm = ({ eventKey }: { eventKey: string }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [matchNumber, setMatchNumber] = useState('')
  const [day, setDay] = useState('')
  const [time, setTime] = useState('')
  const [teamList, setTeamList] = useState([''])
  const emitError = useErrorEmitter()

  const onSubmit = (e: Event) => {
    e.preventDefault()
    setIsLoading(true)
    createEventMatch(eventKey, {
      redAlliance: teamList.slice(0, 3),
      blueAlliance: teamList.slice(3, 6),
      time: getTimeFromParts(day, time, eventKey),
      key: `qm${matchNumber}`,
    })
      .then(() => route(`/events/${eventKey}`))
      .catch(emitError)
      .finally(() => setIsLoading(false))
  }

  return (
    <Form onSubmit={onSubmit}>
      {(isValid) => (
        <>
          <TextInput label="Match Number" onInput={setMatchNumber} required />
          <TextInput label="Date (in mm/dd format)" required onInput={setDay} />
          <TextInput
            label="Time (in hh:mm format) or leave blank for current time"
            required
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
          <Button disabled={isLoading || !isValid}>
            {isLoading ? 'Creating Match' : 'Create Match'}
          </Button>
        </>
      )}
    </Form>
  )
}

const MatchCreator = ({ eventKey }: { eventKey: string }) => (
  <Page name="Create Match" back={`/events/${eventKey}`}>
    <Card class={cardStyle}>
      <ErrorBoundary>
        <EditorForm eventKey={eventKey} />
      </ErrorBoundary>
    </Card>
  </Page>
)

export default MatchCreator
