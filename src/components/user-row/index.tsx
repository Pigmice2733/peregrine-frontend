import { Attributes } from 'preact'
import Toggle from '@/components/toggle'
import { EditableUser, UserInfo } from '@/api/user'
import Button from '@/components/button'
import { modifyUser } from '@/api/user/modify-user'
import { InnerTextInput } from '@/components/text-input'
import { useErrorEmitter } from '@/components/error-boundary'
import { css } from 'linaria'
import IconButton from '@/components/icon-button'
import { deleteIcon } from '@/icons/delete'
import { useState } from 'preact/hooks'
import { deleteUser } from '@/api/user/delete-user'
import { createDialog } from '@/components/dialog'

interface Props extends Attributes {
  user: UserInfo
  refresh: () => void
}

const tableRowStyle = css`
  text-align: center;
`

export const UserRow = ({ user, refresh = () => {} }: Props) => {
  const emitError = useErrorEmitter()
  const [modifiedUser, setModifiedUser] = useState(user as EditableUser)
  const [hasUnsaved, setHasUnsaved] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const setUserState = (cb: (oldUser: EditableUser) => EditableUser) => {
    setModifiedUser(cb)
    setHasUnsaved(true)
  }
  const save = () => {
    setIsSaving(true)
    modifyUser(user.id, modifiedUser)
      .then(() => {
        setHasUnsaved(false)
      })
      .catch(emitError)
      .finally(() => {
        setIsSaving(false)
        refresh()
      })
  }

  const confirmDelete = () => {
    createDialog({
      confirm: 'Delete',
      dismiss: 'Cancel',
      title: `Delete ${user.username}?`,
      description: `This will remove ${user.firstName} ${user.lastName}`,
    })
      .then((confirmed) => {
        if (confirmed) return deleteUser(user.id).then(refresh)
      })
      .catch(emitError)
  }

  return (
    <tr key={user.id} class={tableRowStyle}>
      <td>
        <InnerTextInput
          value={modifiedUser.username}
          onInput={(e) => {
            const username = (e.target as HTMLInputElement).value
            return setUserState((u) => ({ ...u, username }))
          }}
        />
      </td>
      <td>
        <InnerTextInput
          value={`${modifiedUser.firstName} ${modifiedUser.lastName}`}
          onInput={(e) => {
            const [
              firstName,
              lastName,
            ] = (e.target as HTMLInputElement).value.split(' ')
            return setUserState((u) => ({ ...u, firstName, lastName }))
          }}
        />
      </td>
      <td>
        <InnerTextInput
          value={modifiedUser.password || ''}
          type="password"
          onInput={(e) => {
            const password = (e.target as HTMLInputElement).value
            return setUserState((u) => ({ ...u, password }))
          }}
        />
      </td>
      <td>
        <Toggle
          checked={modifiedUser.roles.isVerified}
          onChange={(v) => {
            setUserState((u) => ({
              ...u,
              roles: { ...u.roles, isVerified: v },
            }))
          }}
        />
      </td>
      <td>
        <Toggle
          checked={modifiedUser.roles.isAdmin}
          onChange={(v) => {
            setUserState((u) => ({ ...u, roles: { ...u.roles, isAdmin: v } }))
          }}
        />
      </td>
      <td>
        <Toggle
          checked={modifiedUser.roles.isSuperAdmin}
          onChange={(v) => {
            setUserState((u) => ({
              ...u,
              roles: { ...u.roles, isSuperAdmin: v },
            }))
          }}
        />
      </td>
      <td>
        <IconButton icon={deleteIcon} onClick={confirmDelete} />
      </td>
      {hasUnsaved && (
        <td>
          <Button disabled={isSaving} onClick={save}>
            {isSaving ? 'Saving' : 'Save'}
          </Button>
        </td>
      )}
    </tr>
  )
}
