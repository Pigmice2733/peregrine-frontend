---
to: src/index.tsx
inject: true
before: </Router>
sh: prettier --write src/index.tsx
---
    <Route<{ <%- props.map(p => p + ': string ').join(';') %> }>
      path="<%- url %>"
      component={asyncRoute(() => import('./<%- filepath.replace(/^src\//, '') %>'))}
    />