import { h } from 'preact'
import { useContext, useEffect } from 'preact/hooks'
import { useSignal } from '@preact/signals'
import AppState from '../../appState'

const VersionSelector = ({ pokemon }) => {
  const { stores, currentPokemon } = useContext(AppState)
  const currentVersion = useSignal('')
  const versionList = useSignal([])

  if (!currentPokemon.value.id) return ''

  useEffect(async () => {
    if (!currentPokemon.value.version) {
      const { versions } = await stores.value.pokemon_version.getItem(
        currentPokemon.value.id
      )
      currentPokemon.value.version = versions[0]
      currentVersion.value = versions[0]
      versionList.value = await Promise.all(
        versions.map(async version => {
          const { name } = await stores.value.version_group_name.getItem(
            version
          )
          return <option value={version}>{name}</option>
        })
      )
    }
  }, [currentPokemon.value.id])
  const onChange = e => {
    currentVersion.value = e.target.value
  }

  return (
    <div style='display: flex; flex-direction:column;'>
      <label>Version</label>
      <select value={currentVersion.value} onChange={onChange}>
        {versionList.value}
      </select>
    </div>
  )
}

export default VersionSelector
