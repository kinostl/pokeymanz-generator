import { h } from 'preact'

const VersionSelector = ({ pokemon }) => {
  if (!pokemon.version_groups) return '' //should actually check for versions
  return (
    <div style='display: flex; flex-direction:column;'>
      <label>Version</label>
      <select>
        {pokemon.version_groups.map(version_group => (
          <option value={version_group[0]}>{version_group[1]}</option>
        ))}
      </select>
    </div>
  )
}

export default VersionSelector
