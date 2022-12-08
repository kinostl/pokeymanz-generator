import { h } from 'preact'
import { useEffect, useContext } from 'preact/hooks'
import { useSignal } from '@preact/signals'
import style from './style.css'
import AppState from '../../appState'

const PokemonSearch = () => {
  const { stores, currentPokemon } = useContext(AppState)

  const pokemonSearchError = useSignal('')
  const currentPokemonInput = useSignal('')
  const listOfPokemonNames = useSignal([])
  const listOfPokemonIds = useSignal([])
  const nameIdMap = useSignal({})

  useEffect(async () => {
    const names = []
    const ids = []
    const _nameIdMap = {}
    await stores.value.pokemon_name.iterate(({ id, name, order }) => {
      names[order] = <option value={name} />
      ids[order] = id
      _nameIdMap[name.toLowerCase()] = id
    })
    listOfPokemonNames.value = names
    listOfPokemonIds.value = ids
    nameIdMap.value = _nameIdMap
  }, [stores.value.pokemon_name])

  const onSubmit = async e => {
    e.preventDefault()
    pokemonSearchError.value = ''
    const pokemon = nameIdMap.value[currentPokemonInput.value.toLowerCase()]
    if (pokemon && listOfPokemonIds.value.includes(pokemon)) {
      currentPokemon.value = {
        id: pokemon
      }
    } else {
      pokemonSearchError.value = 'Could not find that pokemon'
    }
  }

  return (
    <div class={style.search}>
      <form onSubmitCapture={onSubmit}>
        <input
          list='pokemon'
          name='pokemon'
          value={currentPokemonInput}
          onInput={e => {
            currentPokemonInput.value = e.target.value.trim()
          }}
        />
        <input type='submit' value='Search by Pokemon' />
      </form>
      <p>{pokemonSearchError}</p>
      <datalist id='pokemon'>{listOfPokemonNames.value}</datalist>
    </div>
  )
}

export default PokemonSearch
