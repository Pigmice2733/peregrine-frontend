import { createRollupConfig } from 'rollup-plugin-netlify-optimize'
import { presets, plugins } from './.babelrc'

export default createRollupConfig(
  {
    babelPlugins: plugins,
    babelPresets: presets,
    routes: {
      '/': './routes/home',
      '/event/:eventKey/info': './routes/event-info',
    },
  },
  process.env.NODE_ENV,
)
