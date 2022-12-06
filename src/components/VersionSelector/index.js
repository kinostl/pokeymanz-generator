import { h } from 'preact'
import { useContext, useEffect } from 'preact/hooks'
import AppState from '../../appState'

const VersionSelector = ({ pokemon }) => {
  const { stores, currentPokemon } = useContext(AppState)
  if (!currentPokemon.value) return ''
  const currentVersion = useSignal('')
  useEffect(async () => {
    if (!currentPokemon.value.version) {
      const pokemon_versions = await stores.pokemon_versions.getItem(
        currentPokemon
      )
      currentPokemon.value.version = pokemon_versions[0]
      currentVersion.value = pokemon_versions[0]
    }
  }, [currentPokemon])
  const onChange = e => {
    currentVersion.value = e.target.value
    console.log(currentVersion.peek())
  }

  return (
    <div style='display: flex; flex-direction:column;'>
      <label>Version</label>
      <select value={currentVersion.value} onChange={onChange}>
        {pokemon.version_groups.map(version_group => (
          <option value={version_group[0]}>{version_group[1]}</option>
        ))}
      </select>
    </div>
  )
}

export default VersionSelector
