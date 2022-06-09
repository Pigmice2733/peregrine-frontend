import { css } from 'linaria'
import ErrorCard from '@/components/error-card'
import { Heading } from '@/components/heading'

const errorPage = (
  <div
    class={css`
      display: grid;
      max-width: 100%;
      grid-template-columns: 100%;
      grid-template-rows: 1fr auto;
      padding: 1.5rem;
      grid-gap: 1.5rem 1.5rem;
      justify-items: center;
    `}
  >
    <Heading
      level={1}
      class={css`
        font-size: 30pt;
        font-weight: bold;
      `}
    >
      404
    </Heading>
    <ErrorCard
      errorText={
        'The requested URL was not found. Use the button below to go to the home page.'
      }
      buttonText={'return to home page'}
      buttonReference={'/'}
    />
  </div>
)

export default errorPage
