import { createRollupConfig } from 'rollup-plugin-netlify-optimize'
import { presets, plugins } from './.babelrc'

export default createRollupConfig(
  {
    babelPlugins: plugins,
    babelPresets: presets,
  },
  process.env.NODE_ENV,
)
