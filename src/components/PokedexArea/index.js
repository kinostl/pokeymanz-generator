import convert from 'convert'
import { h } from 'preact'
import style from './style.css'

import { useContext, useEffect } from 'preact/hooks'
import { useSignal } from '@preact/signals'
import AppState from '../../appState'

const PokedexArea = () => {
  const { stores, currentPokemon } = useContext(AppState)
  if (!currentPokemon.value.id || !currentPokemon.value.version) return ''
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
  const image = useSignal('')
  const prevImage = useSignal('')

  async function updateVersion () {
    const id = currentPokemon.value.id
    const version = currentPokemon.value.version
    const { entries } = await stores.value.pokemon_entry.getItem(id)
    const { versions } = await stores.value.version_group.getItem(version)
    red_flavor_text.value = entries[versions[0]] || ''
    blue_flavor_text.value = entries[versions[1]] || ''
  }

  const DesktopTable = () => (
    <table style='width:100%;'>
      <tr>
        <td rowSpan={7} style='min-width: 288px;'>
          <img src={image.value} class={style.pokeSprite} />
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

  useEffect(async () => {
    const id = currentPokemon.value.id
    const { details } = await stores.value.pokemon.getItem(id)
    const _image = await stores.value.sprite.getItem(id)
    const _type1 = details.types[0]
      ? await stores.value.type.getItem(details.types[0])
      : { name: '', color: 'transparent' }
    const _type2 = details.types[1]
      ? await stores.value.type.getItem(details.types[1])
      : { name: '', color: 'transparent' }
    name.value = await stores.value.pokemon_name.getItem(id)
    name.value = name.value.name
    category.value = details.category
    type1.value = _type1.name
    type2.value = _type2.name
    type1style.value = `background-color:${_type1.color};color:rgba(0,0,0,0.5)`
    type2style.value = `background-color:${_type2.color};color:rgba(0,0,0,0.5)`
    feet.value = details.height.feet
    andInches.value = details.height.andInches
    meters.value = details.height.meters
    lb.value = details.weight.lb
    kg.value = details.weight.kg
    window.URL.revokeObjectURL(prevImage.value)
    image.value = window.URL.createObjectURL(_image)
    prevImage.value = image.value
    await updateVersion()
  }, [currentPokemon.value.id])

  useEffect(updateVersion, [currentPokemon.value.version])

  return <DesktopTable />
}

export default PokedexArea
