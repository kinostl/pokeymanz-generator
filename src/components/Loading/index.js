import { h } from 'preact'
import { useEffect, useContext } from 'preact/hooks'
import { useSignal } from '@preact/signals'
import style from './style.css'
import AppState from '../../appState'

const Loading = () => {
  const { loading } = useContext(AppState)
  const loadingStates = useSignal([])
  const LoadingBall = () => (
    <img
      src='./assets/pokeball.svg'
      class={[style.rotate, style.pokeball].join(' ')}
    />
  )
  useEffect(() => {
    const _loadingStates = Object.entries(loading.value)
    loadingStates.value = _loadingStates
      .map(([store, state]) => {
        if (state) {
          return (
            <p>
              <LoadingBall />
              {state}
            </p>
          )
        }
        return 0
      })
      .filter(state => state != 0)
  }, [loading.value])
  return (
    <div>
      <p>Downloading a lot of data.</p>
      <p>{loadingStates.value}</p>
    </div>
  )
}

export default Loading
