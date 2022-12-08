import { h } from 'preact'
import { useContext, useEffect } from 'preact/hooks'
import { useSignal } from '@preact/signals'
import AppState from '../../appState'

const VersionSelector = () => {
  const { stores, currentPokemon } = useContext(AppState)
  const versionList = useSignal([])

  if (!currentPokemon.value.id) return ''

  useEffect(async () => {
    if (!currentPokemon.value.version) {
      const { versions } = await stores.value.pokemon_version.getItem(
        currentPokemon.value.id
      )
      const _versionReqs = versions.map(version =>
        stores.value.version_group.getItem(version)
      )

      const _versionList = await Promise.all(_versionReqs)
      const sortedVersionList = _versionList.sort((a, b) => b.order - a.order)
      versionList.value = sortedVersionList.map(({ id, name }) => (
        <option value={id}>{name}</option>
      ))
      currentPokemon.value = {
        ...currentPokemon.value,
        version: sortedVersionList[0].id
      }
    }
  }, [currentPokemon.value.id])
  const onChange = e => {
    currentPokemon.value = {
      ...currentPokemon.value,
      version: e.target.value
    }
  }

  return (
    <div style='display: flex; flex-direction:column;'>
      <label>Version</label>
      <select value={currentPokemon.value.version} onChange={onChange}>
        {versionList.value}
      </select>
    </div>
  )
}

export default VersionSelector
