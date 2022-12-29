import Page from 'src/components/page'
import { getUsers } from 'src/api/user/get-users'
import Loader from 'src/components/loader'
import Authenticated from 'src/components/authenticated'
import { useState, useEffect } from 'preact/hooks'
import { useErrorEmitter } from 'src/components/error-boundary'
import { UserInfo } from 'src/api/user'
import {
  Table,
  Row,
  SortOrder,
  createTextColumn,
  createNumberColumn,
  createBooleanColumn,
} from 'src/components/table'
import Card from 'src/components/card'
import { css } from '@linaria/core'
import { getRealms } from 'src/api/realm/get-realms'
import { Realm } from 'src/api/realm'
import { usePromise } from 'src/utils/use-promise'
import {
  tablePageStyle,
  tablePageWrapperStyle,
  tablePageTableStyle,
} from 'src/utils/table-page-style'

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
  const rows: Row<UserInfo>[] = users.map((user) => ({
    key: user.id,
    value: user,
  }))

  const columns = [
    createTextColumn<UserInfo>('Username', (user) => user.username, {
      renderCell: (username, { id }) => (
        <th scope="row">
          <a class={userLinkStyle} href={`/users/${id}`}>
            {username}
          </a>
        </th>
      ),
    }),
    createTextColumn<UserInfo>('First Name', (user) => user.firstName),
    createTextColumn<UserInfo>('Last Name', (user) => user.lastName),
    createNumberColumn<UserInfo>('ID', (user) => user.id, {
      sortOrder: SortOrder.ASC,
    }),
    createBooleanColumn<UserInfo>('Verified', (user) => user.roles.isVerified),
    createBooleanColumn<UserInfo>('Admin', (user) => user.roles.isAdmin),
    createBooleanColumn<UserInfo>(
      'Super Admin',
      (user) => user.roles.isSuperAdmin,
    ),
    createTextColumn<UserInfo>(
      'Realm',
      (user) =>
        realms.find((r) => r.id === user.realmId)?.name || String(user.realmId),
    ),
  ]

  return (
    <Card class={tablePageTableStyle}>
      <Table columns={columns} rows={rows} />
    </Card>
  )
}

const InnerUsersPage = () => {
  const [users, setUsers] = useState<UserInfo[] | undefined>(undefined)
  const emitError = useErrorEmitter()
  const updateUsers = () => {
    getUsers().then(setUsers).catch(emitError)
  }
  const realms = usePromise(() => getRealms(), [])
  useEffect(updateUsers, [emitError])

  return users && realms ? (
    <UsersTable users={users} realms={realms} />
  ) : (
    <Loader />
  )
}

const UsersPage = () => {
  return (
    <Authenticated
      render={() => (
        <Page
          name="Users"
          back="/"
          class={tablePageStyle}
          wrapperClass={tablePageWrapperStyle}
        >
          <InnerUsersPage />
        </Page>
      )}
    />
  )
}

export default UsersPage
