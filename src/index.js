import 'picnic'
import './style'
import AppComponent from './components/app'
import { createContext } from 'preact'
import AppState from './appState'
import createAppState from './createAppState'

// Check if localforage has the bundle
// If not, download the bundle

const App = () => (
  <AppState.Provider value={createAppState()}>
    <AppComponent />
  </AppState.Provider>
)

export default App
