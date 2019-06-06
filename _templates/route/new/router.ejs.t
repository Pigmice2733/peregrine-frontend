---
to: src/app.tsx
inject: true
before: ]}
sh: prettier --write src/index.tsx
---

          {
            path: '<%- url %>',
            component: () => import('./<%- filepath.replace(/^src\//, '),
          },