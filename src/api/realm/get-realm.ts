import { request } from '../base'
import { Realm } from '.'

// Public realms can be fetched. If logged-in, the user's realm is also available.
export const getRealm = (id: number) => request<Realm>('GET', `realms/${id}`)
