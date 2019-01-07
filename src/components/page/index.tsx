import { h, ComponentChildren, Component } from 'preact'
import style from './style.css'
import { menu } from '@/icons/menu'
import { arrowLeft } from '@/icons/arrow-left'
import IconButton from '../icon-button'
import clsx from 'clsx'

interface Tab {
  name: string
  contents: ComponentChildren | undefined
}

type Props = {
  name: string | JSX.Element | JSX.Element[]
  children?: ComponentChildren
  back?: string | (() => void)
  tabs?: Tab[]
  defaultTab?: string
}

interface State {
  selectedTab: string | undefined
}
class Page extends Component<Props, State> {
  state = {
    selectedTab:
      this.props.defaultTab || (this.props.tabs && this.props.tabs[0].name),
  }
  selectTab = (selectedTab: string) => this.setState({ selectedTab })
  render({ name, children, back, tabs }: Props, { selectedTab }: State) {
    return (
      <div class={clsx(style.page, tabs && style.hasTabs)}>
        <header>
          <div class={style.topRow}>
            <IconButton
              icon={back ? arrowLeft : menu}
              aria-label={back ? 'back' : 'menu'}
              {...(typeof back === 'string'
                ? { href: back }
                : { onClick: back })}
            />
            <span>{name}</span>
          </div>
          {tabs && (
            <div class={style.tabs}>
              {tabs.map(t => (
                <button
                  class={t.name === selectedTab ? style.active : undefined}
                  key={t.name}
                  onClick={() => this.selectTab(t.name)}
                >
                  {t.name}
                </button>
              ))}
            </div>
          )}
        </header>
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
      </div>
    )
  }
}

export default Page
