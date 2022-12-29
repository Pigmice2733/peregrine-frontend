/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly PEREGRINE_API_URL: string | undefined
  readonly IPDATA_API_KEY: string | undefined
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
