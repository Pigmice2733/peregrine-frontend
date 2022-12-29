import { cleanFieldName } from './clean-field-name'
import { StatDescription } from 'src/api/schema'

export const getFieldKey = (
  statDescription: Pick<StatDescription, 'name' | 'period'>,
) => statDescription.period + '::' + cleanFieldName(statDescription.name)
