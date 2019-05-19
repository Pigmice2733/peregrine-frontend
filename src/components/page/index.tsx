import { h, ComponentChildren, JSX } from 'preact'
import style from './style.css'
import { menu } from '@/icons/menu'
import { arrowLeft } from '@/icons/arrow-left'
import IconButton from '../icon-button'
import clsx from 'clsx'
import { ErrorBoundary } from '../error-boundary'
import { useState } from 'preact/hooks'

interface Tab {
  name: string
  contents: ComponentChildren | undefined
}

interface Props {
  name: string | JSX.Element | JSX.Element[]
  children?: ComponentChildren
  back?: string | (() => void)
  tabs?: Tab[]
}

const Page = ({ tabs, back, children, name }: Props) => {
  const [selectedTab, setSelectedTab] = useState(tabs && tabs[0].name)

  return (
    <div class={clsx(style.page, tabs && style.hasTabs)}>
      <header>
        <div class={style.topRow}>
          <IconButton
            icon={back ? arrowLeft : menu}
            aria-label={back ? 'back' : 'menu'}
            {...{ [typeof back === 'string' ? 'href' : 'onClick']: back }}
          />
          <span>{name}</span>
        </div>
        {tabs && (
          <div class={style.tabs}>
            {tabs.map(t => (
              <button
                class={t.name === selectedTab ? style.active : undefined}
                key={t.name}
                onClick={() => setSelectedTab(t.name)}
              >
                {t.name}
              </button>
            ))}
          </div>
        )}
      </header>
      <ErrorBoundary>
        <main>
          {tabs
            ? tabs.map(t => (
                <div
                  key={t.name}
                  class={t.name === selectedTab ? style.active : ''}
                >
                  {t.contents}
                </div>
              ))
            : children}
        </main>
      </ErrorBoundary>
    </div>
  )
}

export default Page
