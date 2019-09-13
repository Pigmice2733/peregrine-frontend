<h1 align="center"><img src="https://raw.githubusercontent.com/Pigmice2733/peregrine-logo/master/logo-with-text.png" alt="Peregrine"></h1>

[![dev build](https://img.shields.io/circleci/project/github/Pigmice2733/peregrine-frontend/dev.svg)](https://circleci.com/gh/Pigmice2733/peregrine-frontend/tree/dev)

Peregrine is a scouting app for FRC competitions. This is the frontend, written in [TypeScript](https://www.typescriptlang.org/) with [Preact](https://preactjs.com/)

## Setup

### Prerequisites

- [Install Node (Current is preferred, not LTS)](https://nodejs.org/en/download/current/)
- Install git ([Windows](https://gitforwindows.org/), [Mac, Linux](https://git-scm.com/downloads))
- [Install VSCode](https://code.visualstudio.com/Download)

#### Recommended VSCode Extensions

Install these by opening the extensions panel in the side bar and searching for them

- [Live Share](https://marketplace.visualstudio.com/items?itemName=MS-vsliveshare.vsliveshare)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [EditorConfig](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)
- [GitLens](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens)
- [Glean](https://marketplace.visualstudio.com/items?itemName=wix.glean)

### Project Setup

- `git clone https://github.com/pigmice2733/peregrine-frontend`
- `cd peregrine-frontend`
- `npm i`
- `npm start` Starts a local server with HMR on port `2733`
- `npm run build` Creates an optimized build with code splitting (output is still readable)
- `NODE_ENV=production npm run build` Creates an optimized build with code splitting (output is mangled and not readable)

We are using [Parcel](https://parceljs.org/) as our development bundler/server, because it is fast and supports HMR (automatically injecting changes into a running site). We are using [Rollup](https://rollupjs.org) in production because it is able to make highly optimized bundles with scope hoisting, tree shaking, and code splitting.
