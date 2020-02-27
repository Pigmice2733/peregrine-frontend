import { encode, QueryObj } from 'qss'

export const encodeQs = (qs: QueryObj) =>
  encode(qs, '?')
    // un-encode %3A to : to make URL more readable
    .replace(/%3A/g, ':')
    // If it is just a '?' then don't include the ?
    .replace(/\?$/, '')
