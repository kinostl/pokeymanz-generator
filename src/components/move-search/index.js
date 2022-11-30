import { h } from 'preact'
import { useEffect, useState } from 'preact/hooks'
import { signal } from '@preact/signals'
import style from './style.css'
import getMovesSortedByName from '../../lib/getMovesSortedByName'
import { typeColors, categoryColors } from '../../lib/themeColors'

import { Pokedex } from 'pokeapi-js-wrapper'

const MoveSearch = () => {
  const P = new Pokedex()
  const [currentPokemonName, setCurrentPokemonName] = useState()
  const [currentPokemon, setCurrentPokemon] = useState({})
  const [pokemonSearchError, setPokemonSearchError] = useState(false)
  const [listOfPokemonNames, setListofPokemonNames] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(async () => {
    const res = await P.resource('api/v2/pokedex/1/')
    const names = res.pokemon_entries.map(entry => entry.pokemon_species.name)
    setListofPokemonNames(names)
  }, [])

  const onSubmit = async e => {
    e.preventDefault()
    setPokemonSearchError(false)
    const pokemon = currentPokemonName.toLowerCase()
    if (listOfPokemonNames.includes(pokemon)) {
      setLoading(true)
      const res = await P.getPokemonByName(pokemon)
      const moves = await getMovesSortedByName(res)
      setCurrentPokemon({
        ...res,
        moves
      })
      setLoading(false)
    } else {
      setPokemonSearchError(true)
    }
  }

  return (
    <div class={style.home}>
      <h1>Welcome to Fake Pokeyman Helper</h1>
      <p>
        Type in a name, hit submit, and get a table of moves that you can copy
        into a Google Doc to get the format everyone likes.
      </p>
      <p>
        Feel free to make feature requests on the{' '}
        <a href='https://github.com/kinostl/pokeymanz-generator/issues'>
          issues page
        </a>{' '}
        or Direct Message ZoneBooth (Trick Room) on the Pokeymanz server.
      </p>
      <form onSubmitCapture={onSubmit}>
        <input
          list='pokemon'
          name='pokemon'
          value={currentPokemonName}
          onInput={e => {
            setCurrentPokemonName(e.target.value)
          }}
        />
        <input type='submit' value='Search by Pokemon' />
      </form>
      {pokemonSearchError ? <p>Could not find that pokemon</p> : ''}

      <datalist id='pokemon'>
        {listOfPokemonNames.map(entry => (
          <option value={entry}></option>
        ))}
      </datalist>
      {!loading ? (
        <img
          src={currentPokemon.sprites?.front_default}
          style='position:absolute;top:0;right:0;'
        />
      ) : (
        ''
      )}
      <div class={style.moves_area}>
        {!loading && currentPokemon.moves
          ? currentPokemon.moves.map(o => (
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
                        {move.type.name}
                      </td>
                      <td
                        style={`background-color:${
                          categoryColors[move.damage_class.name]
                        };color:rgba(255,255,255,0.75)`}
                        class={style.move_category}
                      >
                        {move.damage_class.name}
                      </td>
                    </tr>
                  ))}
                </table>
              </section>
            ))
          : ''}
        {loading ? 'Loading a lot of data, please wait. ⏳' : ''}
      </div>
    </div>
  )
}

export default MoveSearch
