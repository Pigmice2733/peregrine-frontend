---
to: <%- filepath %>/index.tsx
sh: prettier --write <%- filepath %>/index.tsx
---

import { h } from 'preact'
import Page from '@/components/page'
import style from './style'

interface Props {
<% props.forEach(prop => { _%>
  <%- prop %>: string
<% }) %>
}

const <%- name %> = ({<%- props.join(', ') %>}: Props) => (
  <Page name="<%- name %>">
    <h1><%- name %> - {JSON.stringify({<%- props.join(', ') %>})}</h1>
  </Page>
)

export default <%- name %>