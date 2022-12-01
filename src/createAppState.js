import { signal, computed } from '@preact/signals'

function createAppState () {
  const currentPokemonName = signal('')
  const currentPokemon = signal({})
  const listOfPokemonNames = signal([])
  const loading = signal(false) // gonna be honest this one seems like a hack

  return { loading, currentPokemonName, currentPokemon, listOfPokemonNames }
}
export default createAppState
