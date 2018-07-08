import { createPrerenderConfig } from 'rollup-plugin-netlify-optimize'
import { presets, plugins } from './.babelrc'

export default createPrerenderConfig({
  babelPlugins: plugins,
  babelPresets: presets,
  routes: {
    '/': './routes/home',
    '/event/:eventKey/info': './routes/event-info',
  },
})
