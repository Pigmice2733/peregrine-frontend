---
to: <%- filepath %>.tsx
sh: prettier --write <%- filepath %>.tsx
---

import { h } from 'preact'
import Page from 'src/components/page'

interface Props {
<% props.forEach(prop => { _%>
  <%- prop %>: string
<% }) %>
}

const <%- name %> = ({<%- props.join(', ') %>}: Props) => (
  <Page name="<%- name %>" back={false}>
    <h1><%- name %> - {JSON.stringify({<%- props.join(', ') %>})}</h1>
  </Page>
)

export default <%- name %>