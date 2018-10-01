import { h, ComponentChildren } from 'preact'
import style from './style.css'
import { menu } from '../../icons'
import Icon from '../../components/icon'

interface Props {
  name: string
  children: ComponentChildren
}

const Page = ({ name, children }: Props) => (
  <div class={style.page}>
    <header>
      <Icon icon={menu} />
      <span>{name}</span>
    </header>
    <main>{children}</main>
  </div>
)

export default Page
