import { signal, computed } from '@preact/signals'

function createAppState () {
  const currentPokemon = signal({})
  const stores = signal({})
  const loading = signal(true)

  return {
    currentPokemon,
    stores,
    loading
  }
}
export default createAppState
