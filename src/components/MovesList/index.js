import { useSignal } from '@preact/signals'
import { h } from 'preact'
import { useEffect } from 'preact/hooks'
import style from './style.css'

const MovesList = () => {
  const move_list = useSignal([])
  const generate_move_list = req => {}
  const generate_moves_section = req => {}
  const generate_moves_area = req => {
    Object.entries(req).map((method, moves) => {})
  }

  useEffect(async () => {
    const id = currentPokemon.value.id
    const version = currentPokemon.value.version
    const { moves } = await stores.value.pokemon_move.getItem(id)
    const version_moves = moves[version]
    move_list = generate_move_list(version_moves)
  }, [currentPokemon.value.id, currentPokemon.value.version])

  if (!currentPokemon.value.id || !currentPokemon.value.version) return ''
  return <div class={style.moves_area}>{move_list.value}</div>
  return (
    <section id={method}>
      <header>
        <h2>{method}</h2>
        <p class='tagline'>{method}</p>
      </header>
      <table>
        <tr>
          <th>Name</th>
          <th>Description</th>
          <th>Category</th>
          <th>Type</th>
        </tr>
        {moves.map(move => (
          <tr>
            <td class={style.move_name}>{move.name}</td>
            <td class={style.move_effect}>{move.effect}</td>
            <td
              style={`background-color:${
                typeColors[move.type.name]
              };color:rgba(0,0,0,0.5)`}
              class={style.move_type}
            >
              {startCase(move.type.name)}
            </td>
            <td
              style={`background-color:${
                categoryColors[move.damage_class.name]
              };color:rgba(255,255,255,0.75)`}
              class={style.move_category}
            >
              {startCase(move.damage_class.name)}
            </td>
          </tr>
        ))}
      </table>
    </section>
  )
}

export default MovesList
