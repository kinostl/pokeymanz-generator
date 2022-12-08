import { h } from 'preact'
import { Router } from 'preact-router'
import loadStores from '../lib/loadStores'
import { useEffect, useContext } from 'preact/hooks'
import AppState from '../appState'

// Code-splitting is automated for `routes` directory
import Home from '../routes/home'
import baseroute from '../baseroute'

//<Home path={`${baseroute}/pkmn/:name`} />
const effectLock = 'pokemon'
const App = () => {
  const { stores, loading } = useContext(AppState)
  useEffect(async () => {
    stores.value = await loadStores(loading)
  }, [effectLock])

  return (
    <div id='app'>
      <Router>
        <Home path={`${baseroute}/`} />
      </Router>
    </div>
  )
}

export default App
