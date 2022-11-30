import { h } from 'preact'
import { useContext, useEffect, useState } from 'preact/hooks'
import { signal, useSignal } from '@preact/signals'
import style from './style.css'
import getPokemonWithMovesSortedByName from '../../lib/getPokemonWithMovesSortedByName'
import { typeColors, categoryColors } from '../../lib/themeColors'
import startCase from 'lodash/startCase'
import AppState from '../../appState'

const PokemonSearch = () => {
  const pokemonSearchError = useSignal('')
  const loading = useSignal(false)
  const currentPokemonInput = useSignal('')
  const { listOfPokemonNames, currentPokemon, currentPokemonName } =
    useContext(AppState)

  const onSubmit = async e => {
    e.preventDefault()
    pokemonSearchError.value = ''
    const pokemon = currentPokemonInput.value.toLowerCase()
    if (listOfPokemonNames.value.includes(pokemon)) {
      currentPokemonName.value = pokemon
      loading.value = true
      const pokemonWithMovesSortedByName =
        await getPokemonWithMovesSortedByName(pokemon)
      currentPokemon.value = pokemonWithMovesSortedByName
      loading.value = false
    } else {
      pokemonSearchError.value = 'Could not find that pokemon'
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
          value={currentPokemonInput}
          onInput={e => {
            currentPokemonInput.value = e.target.value
          }}
        />
        <input type='submit' value='Search by Pokemon' />
      </form>
      <p>{pokemonSearchError}</p>

      <datalist id='pokemon'>
        {listOfPokemonNames.value.map(entry => (
          <option value={entry}></option>
        ))}
      </datalist>
      {!loading.value ? (
        <img
          src={currentPokemon.value.sprites?.front_default}
          style='position:absolute;top:0;right:0;'
        />
      ) : (
        ''
      )}
      <div class={style.moves_area}>
        {!loading.value && currentPokemon.value.moves
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
            ))
          : ''}
        {loading.value ? 'Loading a lot of data, please wait. ⏳' : ''}
      </div>
    </div>
  )
}

export default PokemonSearch
