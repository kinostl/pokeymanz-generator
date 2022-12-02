import { h } from 'preact'
import { useContext, useEffect } from 'preact/hooks'
import AppState from '../../appState'
import { Pokedex } from 'pokeapi-js-wrapper'
import style from './style.css'
// Code-splitting is automated for `routes` directory
// We'll remember that when we add a new Header and more Search Bys

import PokemonSearch from '../../components/PokemonSearch'
import AbilityList from '../../components/AbilityList'
import MovesList from '../../components/MovesList'
import PokedexArea from '../../components/PokedexArea'

const Home = () => {
  const { listOfPokemonNames, loading, currentPokemon } = useContext(AppState)
  const P = new Pokedex()
  useEffect(async () => {
    const res = await P.resource('api/v2/pokedex/1/')
    const names = res.pokemon_entries.map(entry => entry.pokemon_species.name)
    listOfPokemonNames.value = names
  }, [])

  return (
    <div class='home'>
      <h1>
        <img src='./assets/pokeball.svg' style='max-width:25px;' />
        Welcome to Fake Pokeyman Helper
        <img src='./assets/pokeball.svg' style='max-width:25px;' />
      </h1>
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
      <p>Note - You need to resize images yourself.</p>
      <PokemonSearch style='width:100%;' />
      {loading.value ? (
        <p>Loading a lot of data, please wait. ⏳</p>
      ) : (
        <div>
          <PokedexArea pokemon={currentPokemon.value} />
          <AbilityList pokemon={currentPokemon.value} />
          <MovesList pokemon={currentPokemon.value} />
        </div>
      )}
    </div>
  )
}

export default Home
