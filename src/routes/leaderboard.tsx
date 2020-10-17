import { RenderableProps } from 'preact'
import Page from '@/components/page'
import { usePromise } from '@/utils/use-promise'
import { getLeaderboard } from '@/api/get-leaderboard'
import Spinner from '@/components/spinner'
import Card from '@/components/card'
import { css } from 'linaria'
import Authenticated from '@/components/authenticated'
import { useQueryState } from '@/utils/use-query-state'
import { useYears } from '@/utils/use-years'
import { Dropdown } from '@/components/dropdown'
import { getFastestUser } from '@/cache/users/get-fastest'
import { UserInfo } from '@/api/user'

const leaderboardCardTitleStyle = css`
  font-weight: 500;
  font-size: 1.2rem;
  margin: 0.8rem;
`

const LeaderboardCard = ({
  user,
}: {
  user: UserInfo & { reports: number }
}) => {
  return (
    <Card>
      <h1 class={leaderboardCardTitleStyle}>
        {user.firstName} {user.lastName} - {user.reports}
      </h1>
    </Card>
  )
}

const leaderboardListStyle = css`
  display: grid;
  grid-template-columns: 20rem;
  justify-content: center;
  grid-gap: 0.8rem;
  padding: 0.8rem;
`

const currentYear = new Date().getFullYear()
const LeaderboardList = () => {
  const [yearVal, setYear] = useQueryState('year', currentYear)
  const year = Number(yearVal)
  const years = useYears()
  const leaderboard = usePromise(async () => {
    const leaderboard = await getLeaderboard(year)
    return Promise.all(
      leaderboard.map(({ reporterId, reports }) =>
        getFastestUser(reporterId).then((userInfo) => ({
          ...userInfo,
          reports,
        })),
      ),
    )
  }, [year])

  return (
    <div class={leaderboardListStyle}>
      <Dropdown options={years} onChange={setYear} value={year} />
      {leaderboard?.map((user) => (
        <LeaderboardCard key={user.id} user={user} />
      )) || <Spinner />}
    </div>
  )
}

const Leaderboard = () => {
  return (
    <Authenticated
      render={() => (
        <Page name="Leaderboard" back="/">
          <LeaderboardList />
        </Page>
      )}
    />
  )
}

export default Leaderboard
