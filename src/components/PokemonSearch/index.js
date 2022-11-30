import { h } from 'preact'
import { useContext } from 'preact/hooks'
import { useSignal } from '@preact/signals'
import style from './style.css'
import getPokemonWithMovesSortedByName from '../../lib/getPokemonWithMovesSortedByName'
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
      const pokemonWithMovesSortedByName =
        await getPokemonWithMovesSortedByName(pokemon)
      currentPokemon.value = pokemonWithMovesSortedByName
      loading.value = false
    } else {
      pokemonSearchError.value = 'Could not find that pokemon'
    }
  }

  return (
    <div class={style.search}>
      <h1>Welcome to Fake Pokeyman Helper</h1>
      <p>
        Type in a name, hit submit, and get a table of moves that you can copy
        into a Google Doc to get the format everyone likes.
      </p>
      <p>
        Feel free to make feature requests on the{' '}
        <a href='https://github.com/kinostl/pokeymanz-generator/issues'>
          issues page
        </a>{' '}
        or Direct Message ZoneBooth (Trick Room) on the Pokeymanz server.
      </p>
      <form onSubmitCapture={onSubmit}>
        <input
          list='pokemon'
          name='pokemon'
          value={currentPokemonInput}
          onInput={e => {
            currentPokemonInput.value = e.target.value
          }}
        />
        <input type='submit' value='Search by Pokemon' />
      </form>
      <p>{pokemonSearchError}</p>

      <datalist id='pokemon'>
        {listOfPokemonNames.value.map(entry => (
          <option value={entry}></option>
        ))}
      </datalist>
      {loading.value ? <p>Loading a lot of data, please wait. ⏳</p> : ''}
    </div>
  )
}

export default PokemonSearch
