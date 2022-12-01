import { h } from 'preact'
const AbilityList = ({ pokemon }) => {
  console.log(pokemon)
  if (!pokemon.abilities) return ''
  return (
    <table>
      <tr>
        <th colSpan={2}>Abilities</th>
      </tr>
      {pokemon.abilities.map(o => (
        <tr>
          <td>{o[0]}</td>
          <td>{o[1]}</td>
        </tr>
      ))}
    </table>
  )
}
export default AbilityList