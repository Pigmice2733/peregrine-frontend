import { createRollupConfig } from 'rollup-plugin-netlify-optimize'
import * as babelConfig from './.babelrc'

export default createRollupConfig(
  {
    babelConfig,
    routes: {
      '/': './routes/home',
      '/event/:eventKey/info': './routes/event-info',
    },
  },
  process.env.NODE_ENV,
)
