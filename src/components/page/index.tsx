import { h, ComponentChildren } from 'preact'
import style from './style.css'
import { menu, arrowLeft } from '../../icons'
import Icon from '../../components/icon'

interface Props {
  name: string | JSX.Element
  children: ComponentChildren
  back?: string
}

const Page = ({ name, children, back }: Props) => (
  <div class={style.page}>
    <header>
      {back ? (
        <a href={back}>
          <Icon icon={arrowLeft} />
        </a>
      ) : (
        <Icon icon={menu} />
      )}
      <span>{name}</span>
    </header>
    <main>{children}</main>
  </div>
)

export default Page
