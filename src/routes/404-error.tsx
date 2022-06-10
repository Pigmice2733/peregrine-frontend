import { css } from 'linaria'
import ErrorCard from '@/components/error-card'

const errorPage = (
  <div
    class={css`
      display: grid;
      max-width: 100%;
      grid-template-columns: 100%;
      grid-template-rows: 1fr auto;
      padding: 1.5rem;
      grid-gap: 0rem;
      justify-items: center;
    `}
  >
    <h1 style={`font-size: 36pt; font-weight: bold;`}>404</h1>
    <ErrorCard
      errorText={'The requested URL was not found.'}
      errorText2={'Use the button below to go to the home page.'}
      buttonText={'return to home page'}
      buttonReference={'/'}
    />
  </div>
)

export default errorPage
