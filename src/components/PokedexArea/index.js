import { h } from 'preact'
import style from './style.css'
import AppState from '../../appState'
import { useContext } from 'preact/hooks'

const PokedexArea = () => {
  const { loading, currentPokemon } = useContext(AppState)
  return (
    <>
      {!loading.value && currentPokemon.value.sprites ? (
        <img
          src={currentPokemon.value.sprites.front_default}
          class={style.pokeSprite}
        />
      ) : (
        ''
      )}
    </>
  )
}

export default PokedexArea
