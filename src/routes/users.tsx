import { h } from 'preact'
import Page from '@/components/page'
import { getUsers } from '@/api/user/get-users'
import Spinner from '@/components/spinner'
import Authenticated from '@/components/authenticated'
import { UserRow } from '@/components/user-row'
import { useState, useEffect } from 'preact/hooks'
import { useErrorEmitter } from '@/components/error-boundary'
import { UserInfo } from '@/api/user'

const UsersTable = () => {
  const [users, setUsers] = useState<UserInfo[] | undefined>(undefined)
  const emitError = useErrorEmitter()
  const updateUsers = () => {
    getUsers()
      .then(setUsers)
      .catch(emitError)
  }
  useEffect(updateUsers, [])

  return users ? (
    <table>
      <thead>
        <tr>
          <th>Username</th>
          <th>Name</th>
          <th>Password</th>
          <th>Verified</th>
          <th>Admin</th>
          <th>Super Admin</th>
          <th>Delete</th>
        </tr>
      </thead>
      <tbody>
        {users
          .sort((a, b) => (a.username > b.username ? 1 : -1))
          .map(u => (
            <UserRow key={u.id} user={u} refresh={updateUsers} />
          ))}
      </tbody>
    </table>
  ) : (
    <Spinner />
  )
}

const UsersPage = () => {
  return (
    <Authenticated
      render={() => (
        <Page name="Users" back="/">
          <UsersTable />
        </Page>
      )}
    />
  )
}

export default UsersPage
