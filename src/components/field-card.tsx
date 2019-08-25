import { h, RenderableProps } from 'preact'
import Card from '@/components/card'
import NumberInput from './number-input'
import { css } from 'linaria'
import Toggle from './toggle'
import { ReportStatDescription, NumberStatDescription } from '@/api/schema'

const fieldCardStyle = css`
  display: grid;
  grid-template-columns: auto auto;
  align-items: center;
  padding: 0.6rem;
  grid-gap: 0.6rem;
  margin: 0.6rem auto;
`

const nameStyle = css`
  font-weight: bold;
`

interface Props<FieldType extends ReportStatDescription> {
  statDescription: FieldType
  value: number | boolean
  onChange: (newValue: number | boolean) => void
}

const isNumberField = (
  value: ReportStatDescription,
): value is NumberStatDescription => value.type === 'number'

const FieldCard = <FieldType extends ReportStatDescription>({
  statDescription,
  onChange,
  value,
}: RenderableProps<Props<FieldType>>) => (
  <Card as="label" class={fieldCardStyle}>
    <div class={nameStyle}>{statDescription.name}</div>
    {isNumberField(statDescription) ? (
      <NumberInput value={value as number} min={0} onChange={onChange} />
    ) : (
      <Toggle checked={value as boolean} onChange={onChange} />
    )}
  </Card>
)

export default FieldCard
