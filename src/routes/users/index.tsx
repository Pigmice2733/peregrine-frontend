import { h } from 'preact'
import Page from '@/components/page'
// import style from './style.css'
import LoadData from '@/load-data'
import { getUsers } from '@/api/user/get-users'
import Spinner from '@/components/spinner'
import Authenticated from '@/components/authenticated'
import { UserRow } from '@/components/user-row'

const Users = () => {
  return (
    <Authenticated
      render={() => (
        <Page name="Users" back="/">
          <LoadData
            data={{
              users: getUsers,
            }}
            renderSuccess={({ users }) =>
              users ? (
                <table>
                  <thead>
                    <tr>
                      <th>Username</th>
                      <th>Name</th>
                      <th>Password</th>
                      <th>Verified</th>
                      <th>Admin</th>
                      <th>Super Admin</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users
                      .sort((a, b) => (a.username > b.username ? 1 : -1))
                      .map(u => (
                        <UserRow key={u.id} user={u} />
                      ))}
                  </tbody>
                </table>
              ) : (
                <Spinner />
              )
            }
          />
        </Page>
      )}
    />
  )
}

export default Users
