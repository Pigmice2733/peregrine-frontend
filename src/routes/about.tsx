import Page from '@/components/page'
import { css } from '@linaria/core'

const pageStyle = css`
  text-align: center;
  padding: 0 1rem;
  margin: auto;
  max-width: 45rem;
`

const headerStyle = css`
  margin-bottom: 0;
  margin-top: 1em;
`

const informationStyle = css`
  font-size: 22px;
`

const sourceStyle = css`
  padding: 1rem 0;

  & h3 {
    margin: 0.3rem;
  }

  & p {
    margin: 0.2rem;
  }
`

const AboutPage = () => {
  return (
    <Page name="About" class={pageStyle}>
      <h1 class={headerStyle}>Welcome to Peregrine!</h1>
      <section class={informationStyle}>
        <p>
          <strong>
            {
              'Peregrine is a completely free, open-source scouting app for FRC competitions. '
            }
          </strong>
          {`
            The frontend is written in TypeScript and the backend is written in
            Go. Peregrine was originally built by students on team 2733 Pigmice in
            2017 and redesigned in the autumn of 2018. Development is ongoing to
            make the website better than ever. Peregrine has been used by 15 teams
            and counting to simplify scouting at FRC competitions.
          `}
        </p>
        <p>
          <strong>
            {'Peregrine handles all of the calculations involved in scouting, '}
          </strong>
          {`
            allowing team members to spend time analyzing data and making
            decisions instead of crunching numbers. It shows an analysis table
            where team members can compare individual statistics or overall
            performance between teams and has pages for each team at each event
            and the matches each team will play in, easily allowing pit crews to
            know when they're up next. All event data and some match scoring
            data is pulled from The Blue Alliance.
          `}
        </p>
        <p>
          <strong>{"It's really easy to get started with Peregrine."}</strong>
          {' Have a team captain or coach send an email to '}
          <a href="mailto:alexv@pigmice.com">alexv@pigmice.com</a>
          {`
             and a member of the Pigmice will add your team to the dropdown on the
            signup page. They will also connect you to a Slack channel where your
            team can ask questions and give you some tips on setting up your team
            with Peregrine.
          `}
        </p>
        <p>
          {`
            If you have any questions about getting your team onboarded to
            Peregrine or using the app, 
          `}
          <strong>
            {
              "please reach out to the Pigmice team's Peregrine lead, Alex Vennebush, "
            }
          </strong>
          {'at '}
          <a href="mailto:alexv@pigmice.com">alexv@pigmice.com</a>
          {'.'}
        </p>
      </section>
      <section class={sourceStyle}>
        <h3>Source code repositories:</h3>
        <p>
          <a href="https://github.com/Pigmice2733/peregrine-frontend">
            frontend (TypeScript and Preact)
          </a>
        </p>
        <p>
          <a href="https://github.com/Pigmice2733/peregrine-backend">
            backend (Go with Postgres)
          </a>
        </p>
      </section>
    </Page>
  )
}

export default AboutPage
