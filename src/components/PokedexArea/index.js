import convert from 'convert'
import { startCase } from 'lodash'
import { h } from 'preact'
import style from './style.css'

const PokedexArea = ({ pokemon }) => {
  if (!pokemon.sprites) return ''
  console.log(pokemon)
  const heightInMeters = convert(pokemon.height, 'decimeters')
    .to('meters')
    .toFixed(1)

  const heightInInches = convert(pokemon.height, 'decimeters')
    .to('inches')
    .toFixed(0)
  const heightInFeet = Math.floor(heightInInches / 12)
  const andInches = heightInInches - heightInFeet * 12
  const weightInLb = convert(pokemon.weight, 'hectograms').to('lb').toFixed(1)
  const weightInKg = convert(pokemon.weight, 'hectograms').to('kg').toFixed(1)
  return (
    <table style='width:100%;'>
      <tr>
        <td rowSpan={7}>
          <img src={pokemon.sprites.front_default} class={style.pokeSprite} />
        </td>
        <td colSpan={3}>{startCase(pokemon.name)}</td>
      </tr>
      <tr>
        <td colSpan={3}>Category</td>
      </tr>
      <tr>
        <td>Types</td>
        <td>First</td>
        <td>Second</td>
      </tr>
      <tr>
        <td>Height</td>
        <td colSpan={2}>{`${heightInFeet}' ${
          andInches < 10 ? `0${andInches}` : andInches
        }" (${heightInMeters} m)`}</td>
      </tr>
      <tr>
        <td>Weight</td>
        <td colSpan={2}>{`${weightInLb} lb (${weightInKg} kg)`}</td>
      </tr>
      <tr>
        <td colSpan={3}>Red Description</td>
      </tr>
      <tr>
        <td colSpan={3}>Blue Description</td>
      </tr>
    </table>
  )
}

export default PokedexArea
