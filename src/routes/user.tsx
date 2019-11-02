import { h } from 'preact'
import Page from '@/components/page'
import Spinner from '@/components/spinner'
import { usePromise } from '@/utils/use-promise'
import { getUser } from '@/api/user/get-user'
import { UserInfo, EditableUser } from '@/api/user'
import Card from '@/components/card'
import { useJWT } from '@/jwt'
import IconButton from '@/components/icon-button'
import { edit } from '@/icons/edit'
import { css } from 'linaria'
import { Heading } from '@/components/heading'

interface UserProfileProps {
  user: UserInfo
  editable?: boolean
}

const profileCardStyle = css`
  margin: 1.5rem;
  max-width: 30rem;
  padding: 1rem;
`

const UserProfile = ({ user }: UserProfileProps) => {
  const updateUserField = (field: keyof EditableUser) => {

  }
  return (
    <Card class={profileCardStyle}>
      <EditableText
        save={(newText: string) => {}}
      >
      {`${user.firstName} ${user.lastName}`}
      <IconButton icon={edit} /></EditableText>
    </Card>
  )
}

const userPageStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const UserPage = ({ userId }: { userId: number }) => {
  const user = usePromise(() => getUser(userId), [userId])
  const { jwt } = useJWT()
  const realm = jwt?.peregrineRealm
  const roles = jwt?.peregrineRoles
  const isCurrentUser = userId === user?.id
  const isSuperAdmin = roles?.isSuperAdmin
  const isAdminInSameRealm = roles?.isAdmin && realm === user?.realmId
  const canEditUser = isCurrentUser || isSuperAdmin || isAdminInSameRealm

  return (
    <Page name="User" back={() => window.history.back()} class={userPageStyle}>
      {user ? <UserProfile user={user} editable={canEditUser} /> : <Spinner />}
    </Page>
  )
}

export default UserPage
