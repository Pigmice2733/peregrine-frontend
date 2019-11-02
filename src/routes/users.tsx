import { h } from 'preact'
import Page from '@/components/page'
import { getUsers } from '@/api/user/get-users'
import Spinner from '@/components/spinner'
import Authenticated from '@/components/authenticated'
import { useState, useEffect } from 'preact/hooks'
import { useErrorEmitter } from '@/components/error-boundary'
import { UserInfo } from '@/api/user'
import {
  Table,
  Row,
  SortOrder,
  createTextColumn,
  createNumberColumn,
  createBooleanColumn,
} from '@/components/table'
import Card from '@/components/card'
import { css } from 'linaria'
import { getRealms } from '@/api/realm/get-realms'
import { Realm } from '@/api/realm'
import { usePromise } from '@/utils/use-promise'

const usersTableStyle = css`
  margin: 1rem auto;
`

const usersPageStyle = css`
  display: flex;
  justify-content: center;
`

const userLinkStyle = css`
  display: block;
  padding: 0.8rem 0.6rem;
  color: inherit;
  text-decoration: none;
`

const UsersTable = ({
  users,
  realms,
}: {
  users: UserInfo[]
  realms: Realm[]
}) => {
  const rows: Row<UserInfo>[] = users.map(user => ({
    key: user.id,
    value: user,
  }))

  const columns = [
    createTextColumn<UserInfo>('Username', user => user.username, {
      renderCell: (username, { id }) => (
        <th scope="row">
          <a class={userLinkStyle} href={`/users/${id}`}>
            {username}
          </a>
        </th>
      ),
    }),
    createTextColumn<UserInfo>('First Name', user => user.firstName),
    createTextColumn<UserInfo>('Last Name', user => user.lastName),
    createNumberColumn<UserInfo>('ID', user => user.id, {
      sortOrder: SortOrder.ASC,
    }),
    createBooleanColumn<UserInfo>('Verified', user => user.roles.isVerified),
    createBooleanColumn<UserInfo>('Admin', user => user.roles.isAdmin),
    createBooleanColumn<UserInfo>(
      'Super Admin',
      user => user.roles.isSuperAdmin,
    ),
    createTextColumn<UserInfo>(
      'Realm',
      user =>
        realms.find(r => r.id === user.realmId)?.name || String(user.realmId),
    ),
  ]

  return (
    <div class={usersPageStyle}>
      <Card class={usersTableStyle}>
        <Table columns={columns} rows={rows} />
      </Card>
    </div>
  )
}

const InnerUsersPage = () => {
  const [users, setUsers] = useState<UserInfo[] | undefined>(undefined)
  const emitError = useErrorEmitter()
  const updateUsers = () => {
    getUsers()
      .then(setUsers)
      .catch(emitError)
  }
  const realms = usePromise(() => getRealms(), [])
  useEffect(updateUsers, [])

  return users && realms ? (
    <UsersTable users={users} realms={realms} />
  ) : (
    <Spinner />
  )
}

const UsersPage = () => {
  return (
    <Authenticated
      render={() => (
        <Page name="Users" back="/">
          <InnerUsersPage />
        </Page>
      )}
    />
  )
}

export default UsersPage
