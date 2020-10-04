import { css } from 'linaria'
import { useEffect, useState } from 'preact/hooks'

const spinnerStyle = css`
  width: 7rem;
  height: 7rem;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;

  --zoom-timing: 1.5s;
  --zoom-offset: 0.75s;

  &::before,
  &::after {
    position: absolute;
    content: '';
    border-radius: 50%;
    display: block;
    visibility: hidden;
    opacity: 0;
    width: 1.2rem;
    height: 1.2rem;
  }
  &::before {
    animation: change-color 4s infinite,
      zoom linear var(--zoom-timing) infinite 0s,
      fadeout var(--zoom-timing) infinite 0s;
  }
  &::after {
    animation: change-color 4s infinite,
      zoom linear var(--zoom-timing) infinite var(--zoom-offset),
      fadeout var(--zoom-timing) infinite var(--zoom-offset);
  }

  @keyframes change-color {
    0% {
      color: red;
    }
    20% {
      color: green;
    }
    40% {
      color: purple;
    }
    60% {
      color: orange;
    }
    80% {
      color: blue;
    }
    100% {
      color: red;
    }
  }

  @keyframes zoom {
    0% {
      transform: scale(1);
      box-shadow: 0px 0px 0px 0.25rem currentColor;
    }
    100% {
      transform: scale(3);
      box-shadow: 0px 0px 0px calc(0.25rem / 3) currentColor;
    }
  }
  @keyframes fadeout {
    0% {
      opacity: 1;
      display: block;
      visibility: visible;
    }

    100% {
      visibility: visible;
      opacity: 0;
      display: block;
    }
  }
`

const Spinner = () => {
  const [isShown, setIsShown] = useState(false)
  // delay showing until 100ms
  // prevents spinner from showing when loading is < 100ms
  // makes user experience less jarring
  useEffect(() => {
    const t = setTimeout(() => setIsShown(true), 100)
    return () => clearTimeout(t)
  }, [])
  return isShown ? <div class={spinnerStyle} /> : null
}

export default Spinner
