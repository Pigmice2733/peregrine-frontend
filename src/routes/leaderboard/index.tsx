import { h, RenderableProps } from 'preact'
import Page from '@/components/page'
import { usePromise } from '@/utils/use-promise'
import { getLeaderboard, LeaderboardItem } from '@/api/get-leaderboard'
import Spinner from '@/components/spinner'
import Card from '@/components/card'
import { getUser } from '@/api/user/get-user'
import { useCallback } from 'preact/hooks'
import { css } from 'linaria'

const cardStyle = css`
  padding: 0.6rem 1rem;
  margin: 1rem;
  margin-left: auto;
  margin-right: auto;
  max-width: 20rem;

  & h1 {
    font-weight: 500;
    font-size: 1.2rem;
  }
`

const LeaderboardCard = ({
  item,
}: RenderableProps<{ item: LeaderboardItem }>) => {
  const user = usePromise(useCallback(() => getUser(item.reporterId), [item]))

  return (
    <Card class={cardStyle}>
      {user && (
        <h1>
          {user.firstName} {user.lastName} - {item.reports}
        </h1>
      )}
    </Card>
  )
}

const LeaderboardList = () => {
  const leaderboard = usePromise(getLeaderboard)
  if (!leaderboard) return <Spinner />

  return (
    <div>
      {leaderboard.map(i => (
        <LeaderboardCard key={i.reporterId} item={i} />
      ))}
    </div>
  )
}

const Leaderboard = () => {
  return (
    <Page name="Leaderboard" back="/">
      <LeaderboardList />
    </Page>
  )
}

export default Leaderboard
