import { h, Component } from 'preact'
import Toggle from '@/components/toggle'
import { EditableUser, UserInfo } from '@/api/user'
import Button from '@/components/button'
import { modifyUser } from '@/api/user/modify-user'
import { InnerTextInput } from '@/components/text-input'

interface Props {
  user: UserInfo
}
interface State {
  modifiedUser: EditableUser
  hasUnsaved: boolean
  saving: boolean
}

export class UserRow extends Component<Props, State> {
  constructor({ user }: Props) {
    super()
    this.state = {
      modifiedUser: user,
      hasUnsaved: false,
      saving: false,
    }
  }
  setUserState = (cb: (oldUser: EditableUser) => EditableUser) => {
    this.setState((s: State) => ({
      modifiedUser: cb(s.modifiedUser),
      hasUnsaved: true,
    }))
  }
  save = () => {
    this.setState({ saving: true })
    modifyUser(this.props.user.id, this.state.modifiedUser).then(() => {
      this.setState({ saving: false, hasUnsaved: false })
    })
  }
  render({ user }: Props, { modifiedUser, hasUnsaved, saving }: State) {
    return (
      <tr key={user.id}>
        <td>
          <InnerTextInput
            value={modifiedUser.username}
            onInput={e => {
              const username = (e.target as HTMLInputElement).value
              return this.setUserState(u => ({ ...u, username }))
            }}
          />
        </td>
        <td>
          <InnerTextInput
            value={`${modifiedUser.firstName} ${modifiedUser.lastName}`}
            onInput={e => {
              const [
                firstName,
                lastName,
              ] = (e.target as HTMLInputElement).value.split(' ')
              return this.setUserState(u => ({ ...u, firstName, lastName }))
            }}
          />
        </td>
        <td>
          <InnerTextInput
            value={modifiedUser.password || ''}
            type="password"
            onInput={e => {
              const password = (e.target as HTMLInputElement).value
              return this.setUserState(u => ({ ...u, password }))
            }}
          />
        </td>
        <td>
          <Toggle
            checked={modifiedUser.roles.isVerified}
            onChange={v => {
              this.setUserState(u => ({
                ...u,
                roles: { ...u.roles, isVerified: v },
              }))
            }}
          />
        </td>
        <td>
          <Toggle
            checked={modifiedUser.roles.isAdmin}
            onChange={v => {
              this.setUserState(u => ({
                ...u,
                roles: { ...u.roles, isAdmin: v },
              }))
            }}
          />
        </td>
        <td>
          <Toggle
            checked={modifiedUser.roles.isSuperAdmin}
            onChange={v => {
              this.setUserState(u => ({
                ...u,
                roles: { ...u.roles, isSuperAdmin: v },
              }))
            }}
          />
        </td>
        {hasUnsaved && (
          <td>
            <Button disabled={saving} onClick={this.save}>
              {saving ? 'Saving' : 'Save'}
            </Button>
          </td>
        )}
      </tr>
    )
  }
}
