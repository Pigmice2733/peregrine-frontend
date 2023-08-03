import Page from '@/components/page'
import { css } from 'linaria'

const pageStyle = css`
  text-align: center;
  display: grid;
  grid-template-columns: 1fr minmax(60%, 61rem) 1fr;
  padding: 0 1rem;
`

const headerStyle = css`
  grid-column: 2;
  margin-bottom: 0rem;
`

const informationStyle = css`
  font-size: 22px;
  grid-column: 2;
`

const sourceStyle = css`
  padding: 1rem 2rem 0 2rem;
  font-family: monospace;
  grid-column: 2;
`

const boldText = css`
  font-weight: bold;
`

const boldSourceText = css`
  font-weight: bold;
  margin: 0.2rem;
`

const sourceText = css`
  margin: 0.2rem;
`

const AboutPage = () => {
  return (
    <Page name="About" back="/" class={pageStyle}>
      <h1 class={headerStyle}>Welcome to Peregrine!</h1>
      <div class={informationStyle}>
        <p>
          <span class={boldText}>
            Peregrine is a completely free, open-source scouting app for FRC
            competitions.
          </span>{' '}
          The frontend is written in TypeScript and the backend is written in
          Go. Peregrine was originally built by students on team 2733 Pigmice in
          2017 and redesigned in the autumn of 2018. Development is ongoing to
          make the website better than ever. Peregrine has been used by 15 teams
          and counting to simplify scouting at FRC competitions.
        </p>
        <p>
          <span class={boldText}>
            Peregrine handles all of the calculations involved in scouting
          </span>
          , allowing team members to spend time analyzing data and making
          decisions instead of crunching numbers. It shows an analysis table
          where team members can compare individual statistics or overall
          performance between teams and has pages for each team at each event
          and the matches each team will play in, easily allowing pit crews to
          know when they&rsquo;re up next. All event data and some match scoring
          data is pulled from The Blue Alliance.
        </p>
        <p>
          <span class={boldText}>
            It&rsquo;s really easy to get started with Peregrine.
          </span>{' '}
          Have a team captain or coach send an email to{' '}
          <a href="mailto:alexv@pigmice.com">alexv@pigmice.com</a> and a member
          of the Pigmice will add your team to the dropdown on the signup page.
          They will also connect you to a Slack channel where your team can ask
          questions and give you some tips on setting up your team with
          Peregrine.
        </p>
        <p>
          If you have any questions about getting your team onboarded to
          Peregrine or using the app,{' '}
          <span class={boldText}>
            please reach out to the Pigmice team&rsquo;s Peregrine lead, Alex
            Vennebush
          </span>
          , at alexv@pigmice.com.
        </p>
      </div>
      <div class={sourceStyle}>
        <p class={boldSourceText}>source code repositories: </p>
        <p class={sourceText}>
          {' '}
          <a href="https://github.com/Pigmice2733/peregrine-frontend">
            frontend (TypeScript with the React and Babel plugins){' '}
          </a>
        </p>
        <p class={sourceText}>
          {' '}
          <a href="https://github.com/Pigmice2733/peregrine-backend">
            backend (Go connected to SQL){' '}
          </a>
        </p>
        <p class={sourceText}>current version: public release 1.0.0</p>
      </div>
    </Page>
  )
}

export default AboutPage
