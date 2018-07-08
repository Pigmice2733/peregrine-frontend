export const presets = ({ isModule }) => [
  [
    '@babel/preset-env',
    {
      exclude: ['transform-regenerator'],
      modules: false,
      loose: true,
      targets: {
        esmodules: isModule,
      },
    },
  ],
  ['@babel/preset-typescript', { jsxPragma: 'h', isJSX: true }],
]
export const plugins = ({ isModule }) => [
  [
    '@babel/plugin-transform-react-jsx',
    {
      pragma: 'h',
    },
  ],
  '@babel/plugin-proposal-class-properties',
  '@babel/plugin-syntax-dynamic-import',
]
