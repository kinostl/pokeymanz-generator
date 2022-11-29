import { h } from 'preact'
import { useEffect, useState } from 'preact/hooks'
import { signal } from '@preact/signals'
import groupBy from 'lodash/groupBy'
import mapValues from 'lodash/mapValues'
import toPairs from 'lodash/toPairs'
import style from './style.css'

import { Pokedex } from 'pokeapi-js-wrapper'

const P = new Pokedex()
const listOfPokemonNames = signal([])
const currentPokemon = signal({})

const Home = () => {
  const [currentPokemonName, setCurrentPokemonName] = useState()
  const [pokemonSearchError, setPokemonSearchError] = useState(false)
  const [loading, setLoading] = useState(false)
  useEffect(async () => {
    const res = await P.resource('api/v2/pokedex/1/')
    listOfPokemonNames.value = res.pokemon_entries.map(
      entry => entry.pokemon_species.name
    )
  }, [])

  const onChange = async e => {
    e.preventDefault()
    setPokemonSearchError(false)
    const pokemon = currentPokemonName.toLowerCase()
    if (listOfPokemonNames.value.includes(pokemon)) {
      setLoading(true)
      const res = await P.getPokemonByName(pokemon)
      const sortedMoves = groupBy(
        res.moves,
        o =>
          o.version_group_details[o.version_group_details.length - 1]
            .move_learn_method.name
      )
      const sortedMoveUrls = mapValues(sortedMoves, o =>
        o.map(entry => entry.move.url)
      )
      const sortedMovePromises = toPairs(sortedMoveUrls).map(async pair => [
        pair[0],
        await P.resource(`api/v2/move-learn-method/${pair[0]}`),
        await P.resource(pair[1])
      ])
      const sortedMoveRes = await Promise.all(sortedMovePromises)
      const sortedMovesByName = sortedMoveRes.map(method => [
        method[0],
        method[1].names.filter(o => o.language.name === 'en')[0].name,
        method[1].descriptions.filter(o => o.language.name === 'en')[0]
          .description,
        method[2].map(o => ({
          ...o,
          name: o.names.filter(o => o.language.name === 'en')[0].name
        }))
      ])

      currentPokemon.value = {
        ...res,
        moves: sortedMovesByName
      }
      setLoading(false)
    } else {
      setPokemonSearchError(true)
    }
  }

  return (
    <div class={style.home}>
      <h1>Welcome to Pokeyman Generator</h1>
      <p>Type in a name, hit submit, and get a list of moves.</p>
      <form onSubmitCapture={onChange}>
        <input
          list='pokemon'
          name='pokemon'
          value={currentPokemonName}
          onInput={e => {
            setCurrentPokemonName(e.target.value)
          }}
        />
        <input type='submit' />
      </form>
      {pokemonSearchError ? <p>Could not find that pokemon</p> : ''}

      <datalist id='pokemon'>
        {listOfPokemonNames.value.map(entry => (
          <option value={entry}></option>
        ))}
      </datalist>
      <img
        src={currentPokemon.value.sprites?.front_default}
        style='position:absolute;top:0;right:0;'
      />
      <div class={style.moves_area}>
        {!loading && currentPokemon.value.moves
          ? currentPokemon.value.moves.map(o => (
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
                      <td class={style.move_effect}>
                        {move.effect_entries[0].short_effect}
                      </td>
                      <td class={style.move_type}>{move.type.name}</td>
                      <td class={style.move_category}>
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

export default Home
