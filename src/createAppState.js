import { signal, computed } from '@preact/signals'

function createAppState () {
  const currentPokemonName = signal('')
  const currentPokemon = signal({})
  const listOfPokemonNames = signal([])

  return { currentPokemonName, currentPokemon, listOfPokemonNames }
}
export default createAppState
