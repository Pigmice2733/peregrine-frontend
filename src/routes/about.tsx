import Page from '@/components/page'
import { css } from 'linaria'

const pageStyle = css`
  align-content: center;
`

const AboutPage = () => {
  return (
    <Page name="About" back={() => window.history.back()} class={pageStyle}>
      <h1>Welcome to Peregrine!</h1>
    </Page>
  )
}

export default AboutPage
