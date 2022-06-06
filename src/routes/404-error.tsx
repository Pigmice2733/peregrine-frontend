import Button from '@/components/button'
import { css } from 'linaria'
import { Heading } from '@/components/heading'

const errorPage = (
  /* if the match doesn't exist */
  <div
    class={css`
      display: grid;
      grid-gap: 1rem 0;
      align-items: center;
      justify-items: center;
      grid-template-rows: 4rem 6rem 4rem;
      align-content: space-around;
    `}
  >
    <Heading
      level={1}
      class={css`
        align-self: end;
      `}
    >
      {' '}
      404{' '}
    </Heading>
    <div
      class={css`
        font-size: 16pt;
        align-self: center;
      `}
    >
      <p
        class={css`
          text-align: center;
          line-height: 150%;
        `}
      >
        {' '}
        The requested URL was not found on this server. <br />
        Press the back button to return to the previous page, <br />
        or press the button below to return to the home page.{' '}
      </p>
    </div>
    <Button
      href={`/`}
      class={css`
        align-self: start;
      `}
    >
      {' '}
      Return to Home Page{' '}
    </Button>
  </div>
)

export default errorPage
