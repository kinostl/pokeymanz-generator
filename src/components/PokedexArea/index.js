import convert from 'convert'
import startCase from 'lodash/startCase'
import { h } from 'preact'
import style from './style.css'
import { typeColors } from '../../lib/themeColors'

const PokedexArea = ({ pokemon }) => {
  if (!pokemon.sprites) return ''
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
        <td colSpan={3}>{startCase(pokemon.species.genera)}</td>
      </tr>
      <tr>
        <td>Types</td>
        {pokemon.types[0] ? (
          <td
            style={`background-color:${
              typeColors[pokemon.types[0].type.name]
            };color:rgba(0,0,0,0.5)`}
          >
            {startCase(pokemon.types[0].type.name)}
          </td>
        ) : (
          <td></td>
        )}
        {pokemon.types[1] ? (
          <td
            style={`background-color:${
              typeColors[pokemon.types[1].type.name]
            };color:rgba(0,0,0,0.5)`}
          >
            {startCase(pokemon.types[1].type.name)}
          </td>
        ) : (
          <td></td>
        )}
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
        <td colSpan={3}>{pokemon.species.flavor_text[0]}</td>
      </tr>
      <tr>
        <td colSpan={3}>{pokemon.species.flavor_text[1]}</td>
      </tr>
    </table>
  )
}

export default PokedexArea
