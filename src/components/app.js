import { h } from 'preact'
import { useContext, useEffect } from 'preact/hooks'
import AppState from '../appState'
import { Pokedex } from 'pokeapi-js-wrapper'

// Code-splitting is automated for `routes` directory
import MoveSearch from './move-search'
const App = () => {
  const { listOfPokemonNames } = useContext(AppState)
  const P = new Pokedex()
  useEffect(async () => {
    const res = await P.resource('api/v2/pokedex/1/')
    const names = res.pokemon_entries.map(entry => entry.pokemon_species.name)
    listOfPokemonNames.value = names
  }, [])

  return (
    <div id='app'>
      <MoveSearch />
    </div>
  )
}

export default App
