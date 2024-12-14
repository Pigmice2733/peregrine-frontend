import { request } from '../base'
import { Realm } from '.'

// Public realms will be returned. If logged-in, the user's realm will also be returned.
export const getRealms = () => request<Realm[]>('GET', 'realms').then(realms => realms.sort((a, b) => a.name.localeCompare(b.name)))
