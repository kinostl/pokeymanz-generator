import { useSignal } from '@preact/signals'
import { h } from 'preact'
import { useContext, useEffect } from 'preact/hooks'
import AppState from '../../appState'
import style from './style.css'

const MovesList = () => {
  const move_list = useSignal([])
  const { stores, currentPokemon } = useContext(AppState)

  const generate_move_row = async (move_id, version) => {
    const move = await stores.value.move.getItem(move_id)
    const type = await stores.value.type.getItem(move.type)
    const category = await stores.value.category.getItem(move.category)
    const type_style = `background-color:${type.color};color:rgba(0,0,0,0.5)`
    const category_style = `background-color:${category.color};color:rgba(0,0,0,0.5)`

    return (
      <tr>
        <td>{move.name}</td>
        <td>{move.effect[version]}</td>
        <td style={type_style}>{type.name}</td>
        <td style={category_style}>{category.name}</td>
      </tr>
    )
  }
  const generate_moves_section = async moves => {
    const version = currentPokemon.value.version
    return Promise.all(moves.map(move => generate_move_row(move, version)))
  }

  const generate_move_list = async moves => {
    const move_section = await generate_moves_section(moves)
    return (
      <table>
        <tr>
          <th>Name</th>
          <th>Description</th>
          <th>Category</th>
          <th>Type</th>
        </tr>
        {move_section}
      </table>
    )
  }
  const generate_moves_area = req => {
    return Promise.all(
      Object.entries(req).map(async ([method_id, moves]) => {
        const method = await stores.value.move_learn_method.getItem(method_id)
        const move_list = await generate_move_list(moves)
        return (
          <section id={method.id}>
            <header>
              <h2>{method.name}</h2>
              <p class='tagline'>{method.description}</p>
            </header>
            {move_list}
          </section>
        )
      })
    )
  }

  useEffect(async () => {
    const id = currentPokemon.value.id
    const version = currentPokemon.value.version
    const { moves } = await stores.value.pokemon_move.getItem(id)
    const version_moves = moves[version]
    move_list.value = await generate_moves_area(version_moves)
  }, [currentPokemon.value.id, currentPokemon.value.version])

  if (!currentPokemon.value.id || !currentPokemon.value.version) return ''
  return <div class={style.moves_area}>{move_list.value}</div>
}

export default MovesList
