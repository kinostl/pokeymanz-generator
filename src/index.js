import './style'
import AppComponent from './components/app'
import { createContext } from 'preact'
import AppState from './appState'
import createAppState from './createAppState'
import loadPokemon from './lib/loadPokemon'
import { useEffect } from 'preact/hooks'

// Check if localforage has the bundle
// If not, download the bundle

const App = () => {
  useEffect(async () => {
    console.log(await loadPokemon())
  }, [])
  return <p>Hello world</p>
}

/*
const App = () => (
  <AppState.Provider value={createAppState()}>
    <AppComponent />
  </AppState.Provider>
)
*/
export default App
