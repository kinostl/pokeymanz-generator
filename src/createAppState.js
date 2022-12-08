import { signal, computed } from '@preact/signals'

function createAppState () {
  const currentPokemon = signal({})
  const stores = signal({})

  return {
    currentPokemon,
    stores
  }
}
export default createAppState
