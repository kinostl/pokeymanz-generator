import { h } from 'preact'
import { useContext } from 'preact/hooks'
import { useSignal } from '@preact/signals'
import startCase from 'lodash/startCase'
import style from './style.css'
import getFormattedPokemon from '../../lib/getFormattedPokemon'
import AppState from '../../appState'

const PokemonSearch = () => {
  const pokemonSearchError = useSignal('')
  const currentPokemonInput = useSignal('')
  const { loading, listOfPokemonNames, currentPokemon, currentPokemonName } =
    useContext(AppState)

  const onSubmit = async e => {
    e.preventDefault()
    pokemonSearchError.value = ''
    const pokemon = currentPokemonInput.value.toLowerCase()
    if (listOfPokemonNames.value.includes(pokemon)) {
      currentPokemonName.value = pokemon
      loading.value = true
      const formattedPokemon = await getFormattedPokemon(pokemon)
      currentPokemon.value = formattedPokemon
      loading.value = false
    } else {
      pokemonSearchError.value = 'Could not find that pokemon'
    }
  }

  /*
        <input
          list='pokemon'
          name='pokemon'
          value={currentPokemonInput}
          onInput={e => {
            currentPokemonInput.value = e.target.value.trim()
          }}
        />
        */
  return (
    <div class={style.search}>
      <form onSubmitCapture={onSubmit}>
        <select id='pokemon'>
          {listOfPokemonNames.value.map(entry => (
            <option value={entry}>{startCase(entry)}</option>
          ))}
        </select>
        <div style='display: flex;'>
          <label>Version</label>
          <select style='width:100%' disabled={true}>
            <option>Loading a lot of data</option>
            <option>Red/Blue</option>
            <option>Blue/Green</option>
            <option>Yellow/Pink</option>
          </select>
        </div>
        <input type='submit' value='Search by Pokemon' />
      </form>
      <p>{pokemonSearchError}</p>
    </div>
  )
}

export default PokemonSearch
