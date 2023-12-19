import { css } from 'linaria'

export const tablePageStyle = css`
  padding: 1rem;
  overflow: hidden;
  display: flex;
  justify-content: center;
  @media (max-width: 720px) {
    padding: 0;
  }
`

export const tablePageTableStyle = css`
  height: 100%;
  overflow: auto;
  max-height: calc(100vh - 3.1rem);
`

export const tablePageWrapperStyle = css`
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`
