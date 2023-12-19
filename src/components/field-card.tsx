import { RenderableProps } from 'preact'
import Card from '@/components/card'
import NumberInput from './number-input'
import { css } from 'linaria'
import Toggle from './toggle'
import { ReportStatDescription, NumberStatDescription } from '@/api/schema'
import { cleanFieldName } from '@/utils/clean-field-name'

const fieldCardStyle = css`
  justify-self: stretch;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.6rem;

  & > :first-child {
    margin-right: 0.6rem;
  }
`

const nameStyle = css`
  font-weight: bold;
`

interface Props<FieldType extends ReportStatDescription> {
  statDescription: FieldType
  value: number
  onChange: (newValue: number) => void
}

const isNumberField = (
  value: ReportStatDescription,
): value is NumberStatDescription => value.type === 'number'

const FieldCard = <FieldType extends ReportStatDescription>({
  statDescription,
  onChange,
  value,
}: RenderableProps<Props<FieldType>>) => (
  <Card as="label" outlined class={fieldCardStyle}>
    <div class={nameStyle}>{cleanFieldName(statDescription.name)}</div>
    {isNumberField(statDescription) ? (
      <NumberInput value={value} min={0} onChange={onChange} />
    ) : (
      <Toggle
        checked={Boolean(value)}
        onChange={(value) => onChange(Number(value))}
      />
    )}
  </Card>
)

export default FieldCard
