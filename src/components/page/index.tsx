import { h, ComponentChildren, Component } from 'preact'
import style from './style.css'
import Icon from '@/components/icon'
import { menu } from '@/icons/menu'
import { arrowLeft } from '@/icons/arrow-left'

interface Tab {
  name: string
  contents: ComponentChildren | undefined
}

type Props = {
  name: string | JSX.Element | JSX.Element[]
  children?: ComponentChildren
  back?: string
  tabs?: Tab[]
}

interface State {
  selectedTab: string | undefined
}

class Page extends Component<Props, State> {
  state = {
    selectedTab: this.props.tabs && this.props.tabs[0].name,
  }
  selectTab = (selectedTab: string) => this.setState({ selectedTab })
  render({ name, children, back, tabs }: Props, { selectedTab }: State) {
    return (
      <div class={`${style.page} ${tabs && style.hasTabs}`}>
        <header>
          <div class={style.topRow}>
            {back ? (
              <a href={back} aria-label="back">
                <Icon icon={arrowLeft} />
              </a>
            ) : (
              <Icon icon={menu} />
            )}
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
