import Page from '@/components/page'
import { css } from 'linaria'

const pageStyle = css`
  align-content: center;
`

const textStyle = css`
  font-size: 16pt;
  color: black;
  font-family: Roboto sans-serif serif;
`

const AboutPage = () => {
  return (
    <Page name="About" back="/" class={pageStyle}>
      <h1>Welcome to Peregrine!</h1>
      <div class={textStyle}>
        Peregrine is a scouting app for FRC competitions. The frontend is
        written in TypeScript and the backend is written in Go.
      </div>
    </Page>
  )
}

export default AboutPage
