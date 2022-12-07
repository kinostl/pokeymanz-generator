import convert from 'convert'
import { h } from 'preact'
import style from './style.css'

import { useContext, useEffect } from 'preact/hooks'
import { useSignal } from '@preact/signals'
import AppState from '../../appState'

const PokedexArea = () => {
  const { stores, currentPokemon } = useContext(AppState)
  //All these signals are because of how optimizing preact works.

  const name = useSignal('')
  const category = useSignal('')
  const type1 = useSignal('')
  const type2 = useSignal('')
  const type1style = useSignal('')
  const type2style = useSignal('')
  const feet = useSignal('')
  const andInches = useSignal('')
  const meters = useSignal('')
  const lb = useSignal('')
  const kg = useSignal('')
  const red_flavor_text = useSignal('')
  const blue_flavor_text = useSignal('')

  async function updateVersion () {
    const id = currentPokemon.value.id
    const version = currentPokemon.value.version
    const { entries } = await stores.value.pokemon_entry.getItem(id)
    const { versions } = await stores.value.version_group.getItem(version)
    red_flavor_text.value = entries[versions[0]] || ''
    blue_flavor_text.value = entries[versions[1]] || ''
  }

  useEffect(async () => {
    const id = currentPokemon.value.id
    const { details } = await stores.value.pokemon.getItem(id)
    const _type1 = details.types[0]
      ? await stores.value.type.getItem(details.types[0])
      : { name: '' }
    const _type2 = details.types[1]
      ? await stores.value.type.getItem(details.types[1])
      : { name: '' }
    name.value = await stores.value.pokemon_name.getItem(id)
    name.value = name.value.name
    category.value = details.category
    type1.value = _type1.name
    type2.value = _type2.name
    feet.value = details.height.feet
    andInches.value = details.height.andInches
    meters.value = details.height.meters
    lb.value = details.weight.lb
    kg.value = details.weight.kg
    await updateVersion()

    // < 10 ? `0${pokemon.height.andInches}` : andInches
    /*
            style={`background-color:${
              typeColors[pokemon.types[0].type.name]
            };color:rgba(0,0,0,0.5)`}
    */
  }, [currentPokemon.value.id])

  useEffect(updateVersion, [currentPokemon.value.version])

  if (!currentPokemon.value.id || !currentPokemon.value.version) return ''
  return (
    <table style='width:100%;'>
      <tr>
        <td rowSpan={7}>
          {/*
          <img src={pokemon.sprites.front_default} class={style.pokeSprite} />
  */}
        </td>

        <td colSpan={3}>{name}</td>
      </tr>
      <tr>
        <td colSpan={3}>{category}</td>
      </tr>
      <tr>
        <td>Types</td>
        <td style={type1style}>{type1}</td>
        <td style={type2style}>{type2}</td>
      </tr>
      <tr>
        <td>Height</td>
        <td colSpan={2}>
          {feet}' {andInches}" ({meters} m)
        </td>
      </tr>
      <tr>
        <td>Weight</td>
        <td colSpan={2}>
          {lb} lb ({kg} kg)
        </td>
      </tr>
      <tr>
        <td colSpan={3}>{red_flavor_text}</td>
      </tr>
      <tr>
        <td colSpan={3}>{blue_flavor_text}</td>
      </tr>
    </table>
  )
}

export default PokedexArea
