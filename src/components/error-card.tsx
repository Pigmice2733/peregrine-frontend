import { mdiAlert } from '@mdi/js'
import { css } from 'linaria'
import Button from './button'
import Card from './card'
import Icon from './icon'

interface Props {
  errorText: string
  errorText2?: string
  buttonText: string
  buttonReference: string
}

const cardStyle = css`
  display: grid;
  max-width: 30rem;
  grid-template-columns: 100%;
  padding: 1.5rem;
  grid-gap: 1rem;
  justify-items: center;
  overflow-x: auto;
`

const ErrorCard = ({
  errorText,
  errorText2,
  buttonText,
  buttonReference,
}: Props) => (
  <Card class={cardStyle}>
    <div
      class={css`
        display: grid;
        grid-gap: 0 1rem;
        align-items: center;
        grid-template-columns: 1fr auto;
      `}
    >
      <Icon icon={mdiAlert} />
      <div
        class={css`
          font-size: 18pt;
          font-family: monospace, sans-serif;
          overflow-wrap: normal;
          text-align: center;
        `}
      >
        {errorText}
        {errorText2 && (
          <>
            <br />
            <code> {errorText2} </code>
          </>
        )}
      </div>
    </div>
    <Button href={buttonReference}> {buttonText} </Button>
  </Card>
)

export default ErrorCard
