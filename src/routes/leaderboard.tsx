import Page from 'src/components/page'
import { usePromise } from 'src/utils/use-promise'
import { getLeaderboard } from 'src/api/get-leaderboard'
import Loader from 'src/components/loader'
import Card from 'src/components/card'
import { css } from '@linaria/core'
import Authenticated from 'src/components/authenticated'
import { useQueryState } from 'src/utils/use-query-state'
import { useYears } from 'src/utils/use-years'
import { Dropdown } from 'src/components/dropdown'
import { getFastestUser } from 'src/cache/users/get-fastest'
import { UserInfo } from 'src/api/user'

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
      )) || <Loader />}
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
