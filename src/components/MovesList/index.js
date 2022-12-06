import { h } from 'preact'
import style from './style.css'

const MovesList = ({ pokemon }) => {
  if (!pokemon.moves) return ''
  return (
    <div class={style.moves_area}>
      {pokemon.moves.map(o => (
        <section id={style[o[0]] || o[0]}>
          <header>
            <h2>{o[1]}</h2>
            <p class='tagline'>{o[2]}</p>
          </header>
          <table>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Category</th>
              <th>Type</th>
            </tr>
            {o[3].map(move => (
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
      ))}
    </div>
  )
}

export default MovesList
