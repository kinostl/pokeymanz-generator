import { h } from 'preact'
import { useEffect, useContext } from 'preact/hooks'
import { useSignal } from '@preact/signals'
import style from './style.css'
import AppState from '../../appState'

const PokemonSearch = () => {
  const pokemonSearchError = useSignal('')
  const currentPokemonInput = useSignal('')
  const listOfPokemonNames = useSignal([])
  const listOfPokemonIds = useSignal([])
  const nameIdMap = useSignal({})
  const _loading = useSignal(false)

  const { loading, stores, currentPokemon } = useContext(AppState)

  useEffect(async () => {
    const names = []
    const ids = []
    const _nameIdMap = {}
    _loading.value = true
    await stores.value.pokemon_name.iterate(({ id, name, order }) => {
      names[order] = <option value={name} />
      ids[order] = id
      _nameIdMap[name.toLowerCase()] = id
    })
    listOfPokemonNames.value = names
    listOfPokemonIds.value = ids
    nameIdMap.value = _nameIdMap
    _loading.value = false
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

  if (loading.value.stores) return <p>Loading data bundle.</p>
  if (_loading.value) return <p>Loading pokemon names.</p>
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
