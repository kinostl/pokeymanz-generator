import { h } from 'preact'
import { useContext } from 'preact/hooks'
import AppState from '../../appState'

const VersionSelector = ({ pokemon }) => {
  if (!pokemon.version_groups) return '' //should actually check for versions
  const { currentVersion } = useContext(AppState)
  console.log(currentVersion.peek())
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
