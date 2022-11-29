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

const MoveSearch = () => {
  const [currentPokemonName, setCurrentPokemonName] = useState()
  const [pokemonSearchError, setPokemonSearchError] = useState(false)
  const [loading, setLoading] = useState(false)
  useEffect(async () => {
    const res = await P.resource('api/v2/pokedex/1/')
    listOfPokemonNames.value = res.pokemon_entries.map(
      entry => entry.pokemon_species.name
    )
  }, [])

  const getMovesSortedByName = async res => {
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
    const getEnglish = o => o.language.name === 'en'
    const sortedMovesByName = sortedMoveRes.map(method => [
      method[0],
      method[1].names.filter(getEnglish)[0].name,
      method[1].descriptions.filter(getEnglish)[0].description,
      method[2].map(o => ({
        ...o,
        name: o.names.filter(getEnglish)[0].name,
        effect: o.flavor_text_entries.filter(getEnglish).reverse()[0]
          .flavor_text
      }))
    ])

    return sortedMovesByName
  }

  const onChange = async e => {
    e.preventDefault()
    setPokemonSearchError(false)
    const pokemon = currentPokemonName.toLowerCase()
    if (listOfPokemonNames.value.includes(pokemon)) {
      setLoading(true)
      const res = await P.getPokemonByName(pokemon)
      const moves = await getMovesSortedByName(res)

      currentPokemon.value = {
        ...res,
        moves
      }
      setLoading(false)
    } else {
      setPokemonSearchError(true)
    }
  }

  // Doing it this way to help with copy pasting
  const typeColors = {
    normal: '#c6c6a7',
    fighting: '#d67873',
    flying: '#c6b7f5',
    poison: '#c183c1',
    ground: '#ebd69d',
    rock: '#d1c17d',
    bug: '#c6d16e',
    ghost: '#a292bc',
    steel: '#d1d1e0',
    fire: '#f5ac78',
    water: '#9db7f5',
    grass: '#a7db8d',
    electric: '#fae078',
    psychic: '#fa92b2',
    ice: '#bce6e6',
    dragon: '#a27dfa',
    dark: '#a29288',
    fairy: '#f4bdc9'
  }

  const categoryColors = {
    physical: '#c92112',
    special: '#4f5870',
    status: '#8c888c'
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
