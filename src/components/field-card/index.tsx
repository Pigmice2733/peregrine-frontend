import { h } from 'preact'
import { Field } from '@/api/report'
import Card from '@/components/card'
import EnumSelector from '../enum-selector'
import NumberInput from '../number-input'
import { css } from 'linaria'

const NO_ATTEMPT = 'No'
const FAIL = 'Attempted'
const SUCCESS = 'Succeeded'

const fieldCardStyle = css`
  display: flex;
  align-items: center;
  padding: 0.5rem;
  margin: 0.6rem auto;
  justify-content: space-between;

  & > * {
    margin: 0.5rem;
  }
`

const nameStyle = css`
  font-weight: bold;
`

const numInputLabelStyle = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: 12rem;
`

const FieldCard = ({
  field,
  onChange,
  type,
}: {
  field: Field
  onChange: (newValue: Field) => void
  type: 'boolean' | 'number'
  key?: string
}) => (
  <Card class={fieldCardStyle}>
    <div class={nameStyle}>{field.name}</div>
    {type === 'number' ? (
      <div>
        <div class={numInputLabelStyle}>
          <span>Successes</span>
          <NumberInput
            value={field.successes}
            min={0}
            onChange={successes => {
              const failures = field.attempts - field.successes
              const attempts = successes + failures
              onChange({ ...field, attempts, successes })
            }}
          />
        </div>
        <div class={numInputLabelStyle}>
          <span>Failures</span>
          <NumberInput
            value={field.attempts - field.successes}
            min={0}
            onChange={failures => {
              const successes = field.successes
              const attempts = successes + failures
              onChange({ ...field, attempts, successes })
            }}
          />
        </div>
      </div>
    ) : (
      <EnumSelector
        name={`field ${field.name}`}
        items={[NO_ATTEMPT, FAIL, SUCCESS]}
        selected={
          field.attempts ? (field.successes ? SUCCESS : FAIL) : NO_ATTEMPT
        }
        onChange={val => {
          onChange({
            ...field,
            attempts: Number(val !== NO_ATTEMPT),
            successes: Number(val === SUCCESS),
          })
        }}
      />
    )}
  </Card>
)

export default FieldCard
