import Page from '@/components/page'
import Spinner from '@/components/spinner'
import { getUser } from '@/api/user/get-user'
import { UserInfo, Roles } from '@/api/user'
import Card from '@/components/card'
import { useJWT } from '@/jwt'
import { InlineIconButton } from '@/components/icon-button'
import { edit } from '@/icons/edit'
import { css } from 'linaria'
import TextInput, { TextInputProps } from '@/components/text-input'
import { useState, useEffect, useCallback } from 'preact/hooks'
import { offBlack } from '@/colors'
import { useErrorEmitter, ErrorBoundary } from '@/components/error-boundary'
import { modifyUser } from '@/api/user/modify-user'
import { close } from '@/icons/close'
import { check } from '@/icons/check'
import { sync } from '@/icons/sync'
import { getRealm } from '@/api/realm/get-realm'
import { usePromise } from '@/utils/use-promise'
import Toggle from '@/components/toggle'
import { deleteUser } from '@/api/user/delete-user'
import { deleteIcon } from '@/icons/delete'
import { route } from '@/router'
import { createDialog } from '@/components/dialog'
import Alert, { AlertType } from '@/components/alert'
import Button, { buttonFontStyle } from '@/components/button'
import Icon from '@/components/icon'
import { alert } from '@/icons/alert'
import Authenticated from '@/components/authenticated'
import { minPasswordLength, maxPasswordLength } from '@/constants'
import clsx from 'clsx'
import { getReports } from '@/api/report/get-reports'
import { mdiClipboardTextMultipleOutline } from '@mdi/js'
import { noop } from '@/utils/empty-promise'

const RoleInfo = ({
  save,
  disabled,
  user,
  title,
  roleName,
}: {
  user: UserInfo
  title: string
  roleName: keyof Roles
  disabled: boolean
  save: (updatedInfo: { roles: Roles }) => Promise<unknown>
}) => {
  const [isSaving, setIsSaving] = useState(false)
  const emitError = useErrorEmitter()
  return (
    <>
      <dt>{title}</dt>
      <dd>
        <Toggle
          checked={user.roles[roleName]}
          disabled={disabled || isSaving}
          onChange={(newValue) => {
            setIsSaving(true)
            save({ roles: { ...user.roles, [roleName]: newValue } })
              .catch(emitError)
              .finally(() => setIsSaving(false))
          }}
        />
      </dd>
    </>
  )
}

const VerifiedInfo = ({
  user,
  refetch,
  editable,
}: {
  user: UserInfo
  refetch: () => Promise<unknown>
  editable: boolean
}) => {
  const [isSaving, setIsSaving] = useState(false)
  const { isVerified } = user.roles
  const emitError = useErrorEmitter()
  return (
    <Alert
      type={isVerified ? AlertType.Success : AlertType.Warning}
      class={css`
        display: grid;
        grid-auto-flow: column;
        align-items: center;
        grid-gap: 0.3rem;
      `}
    >
      <Icon
        icon={isVerified ? check : alert}
        class={css`
          width: 1.2rem;
          height: 1.2rem;
        `}
      />
      {isVerified ? 'Verified' : 'Unverified'}
      {editable && (
        <button
          onClick={() => {
            if (isSaving) return
            setIsSaving(true)
            modifyUser(user.id, {
              roles: { ...user.roles, isVerified: !isVerified },
            })
              .then(refetch)
              .catch(emitError)
              .finally(() => setIsSaving(false))
          }}
          disabled={isSaving}
          class={clsx(
            buttonFontStyle,
            css`
              color: ${offBlack};
              background: #00000015;
              border: none;
              border-radius: 0.3rem;
              cursor: pointer;
              outline: none;
              font-size: 0.8rem;
              padding: 0.4rem;
              transition: all 0.3s ease;
              &:hover,
              &:focus {
                background: #2121212e;
              }
            `,
          )}
        >
          {isVerified ? 'Unverify' : 'Verify'}
        </button>
      )}
    </Alert>
  )
}

const iconInButtonStyle = css`
  width: 1rem;
  margin-right: 0.2rem;
  fill: currentColor;
`

const DeleteUserButton = ({ user }: { user: UserInfo }) => {
  const emitError = useErrorEmitter()
  return (
    <Button
      flat
      onClick={() => {
        createDialog({
          confirm: 'Delete',
          dismiss: 'Cancel',
          description:
            'Deleting this user is permanent, but their reports will be preserved.',
          title: `Delete ${user.firstName} ${user.lastName}?`,
        })
          .then((shouldDelete) => {
            if (shouldDelete)
              return deleteUser(user.id).then(() => route('/users'))
          })
          .catch(emitError)
      }}
    >
      <Icon class={iconInButtonStyle} icon={deleteIcon} />
      {`Delete ${user.firstName} ${user.lastName}`}
    </Button>
  )
}

const SetPasswordButton = ({ user }: { user: UserInfo }) => {
  const emitError = useErrorEmitter()
  return (
    <EditableText
      name="password"
      label="Password"
      type="password"
      required
      minLength={minPasswordLength}
      maxLength={maxPasswordLength}
      value={''}
      save={(password) => modifyUser(user.id, { password }).catch(emitError)}
    >
      {(_password, _icon, startEditing) => (
        <Button flat onClick={startEditing}>
          <Icon class={iconInButtonStyle} icon={edit} />
          Set Password
        </Button>
      )}
    </EditableText>
  )
}

interface EditableTextProps {
  children: (
    value: string,
    editIcon: JSX.Element | undefined,
    openEditor: () => void,
  ) => JSX.Element
  save: (newText: string) => Promise<unknown>
  editable?: boolean
  label: string
  value: string
}

const editableTextStyle = css`
  display: grid;
  grid-auto-flow: column;
  grid-gap: 0.2rem;
  align-items: center;
`

const EditableText = ({
  children,
  save,
  label,
  editable,
  value: originalValue,
  ...rest
}: EditableTextProps & TextInputProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [value, setValue] = useState(originalValue)
  const isChanged = value !== originalValue
  const [isSaving, setIsSaving] = useState(false)
  const emitError = useErrorEmitter()
  const closeEditor = () => {
    setIsEditing(false)
    setIsSaving(false)
  }
  const openEditor = () => {
    setIsEditing(true)
    setIsSaving(false)
    setValue(originalValue)
  }
  const saveNewValue = (e: Event) => {
    e.preventDefault()
    if (!isChanged || isSaving) return
    setIsSaving(true)
    save(value).catch(emitError).finally(closeEditor)
  }
  return isEditing ? (
    <form class={editableTextStyle} onSubmit={saveNewValue}>
      <TextInput label={label} value={value} onInput={setValue} {...rest} />
      <InlineIconButton
        icon={isSaving ? sync : check}
        disabled={!isChanged || isSaving}
      />
      <InlineIconButton
        icon={close}
        onClick={(e) => {
          e.preventDefault()
          closeEditor()
        }}
      />
    </form>
  ) : (
    children(
      originalValue,
      editable ? (
        <InlineIconButton icon={edit} onClick={openEditor} />
      ) : undefined,
      openEditor,
    )
  )
}

interface UserProfileProps {
  user: UserInfo
  editable?: boolean
  refetch: () => Promise<unknown>
  isCurrentUser: boolean
  isSuperAdmin: boolean
}

const profileCardStyle = css`
  margin: 1.5rem;
  max-width: 30rem;
  min-width: 20rem;
  padding: 1rem;
  display: grid;
  grid-gap: 1rem;
  justify-items: center;
`
const userNameStyle = css`
  font-size: 1.5rem;
  margin: 0;
`

const UserProfileCard = ({
  user,
  refetch,
  editable = false,
  isCurrentUser,
  isSuperAdmin,
}: UserProfileProps) => {
  const realm = usePromise(() => getRealm(user.realmId), [user.realmId])
  const canEditRoles = editable && !isCurrentUser
  const updateUser = (...args: Parameters<typeof modifyUser>) =>
    modifyUser(...args).then(refetch)
  const reports = usePromise(() => getReports({ reporter: user.id }), [user.id])
  return (
    <Card class={profileCardStyle} as="section">
      <ErrorBoundary>
        <EditableText
          editable={editable}
          label="Name"
          save={(newText) => {
            const [firstName, lastName] = newText.split(/\s+/)
            return updateUser(user.id, { firstName, lastName })
          }}
          value={`${user.firstName} ${user.lastName}`}
        >
          {(value, editIcon) => (
            <h1 class={userNameStyle}>
              {value} {editIcon}
            </h1>
          )}
        </EditableText>
        <EditableText
          editable={editable}
          label="Username"
          save={(username) => updateUser(user.id, { username })}
          value={user.username}
        >
          {(value, editIcon) => (
            <h2
              class={css`
                font-size: 1.2rem;
                font-weight: 500;
                margin: 0;
              `}
            >
              {value} {editIcon}
            </h2>
          )}
        </EditableText>
        {reports && (
          <Button flat href={`/users/${user.id}/reports`}>
            <Icon
              class={iconInButtonStyle}
              icon={mdiClipboardTextMultipleOutline}
            />

            {`${reports.length} reports`}
          </Button>
        )}
        <VerifiedInfo user={user} refetch={refetch} editable={canEditRoles} />
        <dl
          class={css`
            display: grid;
            grid-template-columns: auto auto;
            align-items: center;
            gap: 0.5rem 1rem;

            & dd {
              margin: 0;
            }

            & dt {
              font-weight: bold;
            }
          `}
        >
          <dt>Realm</dt>
          <dd>{realm?.name}</dd>
          <RoleInfo
            disabled={!canEditRoles}
            title="Admin"
            roleName="isAdmin"
            save={(data) => updateUser(user.id, data)}
            user={user}
          />
          <RoleInfo
            disabled={!canEditRoles || !isSuperAdmin}
            title="Super Admin"
            roleName="isSuperAdmin"
            save={(data) => updateUser(user.id, data)}
            user={user}
          />
        </dl>
        {editable && !isCurrentUser && <DeleteUserButton user={user} />}
        {editable && <SetPasswordButton user={user} />}
      </ErrorBoundary>
    </Card>
  )
}

const AnonymousProfileCard = ({ userId }: { userId: number }) => {
  const reports = usePromise(() => getReports({ reporter: userId }), [userId])

  return (
    <Card class={profileCardStyle} as="section">
      <h1 class={userNameStyle}>Anonymous</h1>
      <Alert type={AlertType.Warning}>
        {"You do not have access to this user's profile."}
      </Alert>
      {reports && (
        <Button flat href={`/users/${userId}/reports`}>
          <Icon
            class={iconInButtonStyle}
            icon={mdiClipboardTextMultipleOutline}
          />

          {`${reports.length} reports`}
        </Button>
      )}
    </Card>
  )
}

const userPageStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const InnerUserPage = ({ userId }: { userId: string }) => {
  const [user, setUser] = useState<UserInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const fetchUser = useCallback(() => getUser(userId).then(setUser), [userId])
  const emitError = useErrorEmitter()
  useEffect(() => {
    fetchUser()
      .catch(noop)
      .finally(() => setIsLoading(false))
  }, [emitError, fetchUser])
  const { jwt } = useJWT()
  const realm = jwt?.peregrineRealm
  const roles = jwt?.peregrineRoles
  const isCurrentUser = jwt?.sub === userId
  const isSuperAdmin = roles?.isSuperAdmin
  const isAdminInSameRealm = roles?.isAdmin && realm === user?.realmId
  const canEditUser = isCurrentUser || isSuperAdmin || isAdminInSameRealm

  return (
    <Page name="User" back={() => window.history.back()} class={userPageStyle}>
      {isLoading ? (
        <Spinner />
      ) : user ? (
        <UserProfileCard
          user={user}
          editable={canEditUser}
          refetch={fetchUser}
          isCurrentUser={isCurrentUser}
          isSuperAdmin={isSuperAdmin || false}
        />
      ) : (
        <AnonymousProfileCard userId={Number(userId)} />
      )}
    </Page>
  )
}

const UserPage = ({ userId }: { userId: string }) => {
  return <Authenticated render={() => <InnerUserPage userId={userId} />} />
}

export default UserPage
