import { useSignal } from '@preact/signals'
import { h } from 'preact'
import { useContext, useEffect } from 'preact/hooks'
import AppState from '../../appState'
const AbilityList = () => {
  const { stores, currentPokemon } = useContext(AppState)
  const ability_list = useSignal('')

  const get_ability_row = async ability_id => {
    const ability = await stores.value.ability.getItem(ability_id)
    console.log(ability)
    const version = currentPokemon.value.version
    console.log(version)
    return (
      <tr>
        <td>{ability.name}</td>
        <td>{ability.effect[version]}</td>
      </tr>
    )
  }

  const get_ability_list = async abilities => {
    return Promise.all(
      abilities.map(async ability => await get_ability_row(ability))
    )
  }

  useEffect(async () => {
    const id = currentPokemon.value.id
    const { abilities } = await stores.value.pokemon.getItem(id)
    console.log(abilities)
    ability_list.value = await get_ability_list(abilities)
  }, [currentPokemon.value.id, currentPokemon.value.version])

  if (!currentPokemon.value.id || !currentPokemon.value.version) return ''
  return (
    <table>
      <tr>
        <th colSpan={2}>Abilities</th>
      </tr>
      {ability_list.value}
    </table>
  )
}
export default AbilityList
