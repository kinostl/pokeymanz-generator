import { signal, computed } from '@preact/signals'

function createAppState () {
  const currentPokemon = signal({})
  const currentVersion = signal('')
  const loading = signal({}) // gonna be honest this one seems like a hack
  const stores = signal({})

  return {
    loading,
    currentPokemon,
    currentVersion,
    stores
  }
}
export default createAppState
